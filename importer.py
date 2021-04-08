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
data_day = date.today() - timedelta(days=1)
day_str = data_day.isoformat()
filename = f"{XLSX_STORE_DIR}/{day_str}.xlsx"
with open(filename, 'wb') as f:
    f.write(xlsx_content)

sheet_data = wb.worksheets[2]
rows = sheet_data.rows
state_entries = {}

# read Gesamt_bis_einschl_...
next(rows)  # skip three rows
next(rows)
next(rows)
next(rows)
for row, _ in zip(rows, range(16)):
    def read_int(column):
        value = row[column].value
        if value == '-':
            return 0
        elif value is not None:
            return int(value)


    state = row[1].value.replace('*', '').strip()
    state_entries[state] = {
        'total': {
            'first': read_int(2) + read_int(12),
            'second': read_int(7) + read_int(17),
        },
        'vaccine': {
            'biontech': read_int(3) + read_int(8) + read_int(13) + read_int(18),
            'moderna': read_int(4) + read_int(9) + read_int(14) + read_int(19),
            'astraZen': read_int(5) + read_int(10) + read_int(15) + read_int(20),
        }
    }

# read Indik_bis_einschl_18.01...
sheet_data = wb.worksheets[2]
rows = sheet_data.rows

# # read Gesamt_bis_einschl_...
# next(rows)  # skip two rows
# next(rows)
# next(rows)
# next(rows)
#
# for row, _ in zip(rows, range(16)):
#     def read_int(column):
#         value = row[column].value
#         if value is not None:
#             return int(value)
#
#     state = row[1].value.replace('*', '').strip()
#     state_entry = state_entries[state]
#     state_entry['indication'] = {
#         'age': read_int(2),
#         'occupation': read_int(3),
#         'medical': read_int(4),
#         'nursingHome': read_int(5),
#     }

try:
    with open(EXPORT_FILE) as f:
        history_obj = json.load(f)
except:
    history_obj = {}

day_entry = {
    'states': state_entries,
    'total': {
        'first': sum((state['total']['first'] for state in state_entries.values())),
        'second': sum((state['total']['second'] for state in state_entries.values()))
    }
}
history_obj[day_str] = day_entry

# read Impfungen_proTag
sheet_data = wb.worksheets[3]
rows = sheet_data.rows
next(rows)  # skip first row

FIRST_DAY = date.fromisoformat("2020-12-27")
assert sheet_data['A2'].value.date() == FIRST_DAY  # Assert that we start with the first vaccination day

first_vaccination_total = 0
second_vaccination_total = 0
row_day = FIRST_DAY
for row in rows:
    if not row[0].value or row_day > data_day:
        break
    try:
        first_vaccination_total += int(row[1].value) # last value is a formula referencing to second sheet
    except ValueError:
        break
    if row[2].value:
        second_vaccination_total += int(row[2].value)
    entry = history_obj.setdefault(row_day.isoformat(), {})['total'] = {
        'first': first_vaccination_total,
        'second': second_vaccination_total
    }
    row_day += timedelta(days=1)


with open(EXPORT_FILE, "w") as f:
    json.dump(history_obj, f, indent=1)

print("ok")
