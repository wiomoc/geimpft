from urllib import request
from datetime import date
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
day = date.today()
day_str = day.isoformat()
filename = f"{XLSX_STORE_DIR}/{day_str}.xlsx"
with open(filename, 'wb') as f:
    f.write(xlsx_content)

entries = []
sheet_data = wb.worksheets[1]
rows = sheet_data.rows
next(rows)  # skip first row
for row, _ in zip(rows, range(16)):
    def read_int(column):
        value = row[column].value
        if value is not None:
            return int(value)


    entry = {
        'state': row[1].value.replace('*', ''),
        'total': read_int(2),
        'indicationAge': read_int(5),
        'indicationOccupation': read_int(6),
        'indicationMedical': read_int(7),
        'indicationNursinghome': read_int(8),
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
