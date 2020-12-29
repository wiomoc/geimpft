from urllib import request
from datetime import date
import re
from openpyxl import load_workbook
import os
from io import BytesIO
import json

BASE_URL = "https://www.rki.de/"
LANDING_PAGE_PATH = "DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquoten-Tab.html"
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0'
XLSX_STORE_DIR = "data"
EXPORT_FILE = "data/history.json"
try:
    os.mkdir(XLSX_STORE_DIR)
except:
    pass


def rki_request(path):
    req = request.Request(BASE_URL + path)
    req.add_header('User-Agent', USER_AGENT)
    return request.urlopen(req).read()


landing_page = rki_request(LANDING_PAGE_PATH).decode()
xlsx_path = re.search('href="(.+\\.xlsx.*)"\\s', landing_page).group(1)

xlsx_content = rki_request(xlsx_path)

wb = load_workbook(BytesIO(xlsx_content))

sheet_introduction = wb['Erläuterung']
day_regex = re.compile('Datenstand: (\\d{2})\\.(\d{2})\\.(\\d{4})')
for cell_value in sheet_introduction.values:
    match = day_regex.search(str(cell_value))
    if match is not None:
        day = date(day=int(match.group(1)), month=int(match.group(2)), year=int(match.group(3)))
        break
else:
    raise Exception("day not found")

day_str = day.isoformat()
filename = f"{XLSX_STORE_DIR}/{day_str}.xlsx"
with open(filename, 'wb') as f:
    f.write(xlsx_content)

entries = []

sheet_data = wb['Presse']
rows = sheet_data.rows
next(rows)  # skip first row
for row, _ in zip(rows, range(16)):
    def read_int(column):
        value = row[column].value
        if value is not None:
            return int(value)


    entry = {
        'state': row[0].value.replace('*', ''),
        'total': read_int(1),
        'indication_age': read_int(2),
        'indication_occupation': read_int(3),
        'indication_medical': read_int(4),
        'indication_nursinghome': read_int(5),
    }
    entries.append(entry)

try:
    with open(EXPORT_FILE) as f:
        history_obj = json.load(f)
except:
    history_obj = {}

history_obj[day_str] = entries

with open(EXPORT_FILE, "w") as f:
    json.dump(history_obj, f, indent=1)

print("ok")
