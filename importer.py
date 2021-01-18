from urllib import request
from datetime import date, timedelta
from openpyxl import load_workbook
import os
from io import BytesIO
import json

URL = "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob" \
      "=publicationFile "
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0'
XLSX_STORE_DIR = "data"
EXPORT_FILE = "data/history.json"
try:
    os.mkdir(XLSX_STORE_DIR)
except:
    pass


def rki_request():
    req = request.Request(URL)
    req.add_header('User-Agent', USER_AGENT)
    return request.urlopen(req).read()


xlsx_content = rki_request()

wb = load_workbook(BytesIO(xlsx_content))

sheet_introduction = wb.worksheets[0]
day = date.today() - timedelta(days=1)
day_str = day.isoformat()
filename = f"{XLSX_STORE_DIR}/{day_str}.xlsx"
with open(filename, 'wb') as f:
    f.write(xlsx_content)

sheet_data = wb.worksheets[1]
rows = sheet_data.rows
state_entries = {}

next(rows)  # skip three rows
next(rows)
next(rows)
for row, _ in zip(rows, range(16)):
    def read_int(column):
        value = row[column].value
        if value is not None:
            return int(value)


    state = row[1].value.replace('*', '')
    state_entries[state] = {
        'total': read_int(2),
    }

try:
    with open(EXPORT_FILE) as f:
        history_obj = json.load(f)
except:
    history_obj = {}

day_entry = {
    'states': state_entries,
    'total': sum((state['total'] for state in state_entries.values())) # Redundant
}
history_obj[day_str] = day_entry

sheet_data = wb.worksheets[3]
rows = sheet_data.rows
next(rows)  # skip first row

FIRST_DAY = date.fromisoformat("2020-12-27")
assert sheet_data['A2'].value.date() == FIRST_DAY  # Assert that we start with the first vaccination day

total = 0
day = FIRST_DAY
for row in rows:
    if not row[0].value:
        break
    daily_change = int(row[1].value)
    total += daily_change
    history_obj.setdefault(day.isoformat(), {})["total"] = total
    day += timedelta(days=1)


with open(EXPORT_FILE + ".json", "w") as f:
    json.dump(history_obj, f, indent=1)

print("ok")
