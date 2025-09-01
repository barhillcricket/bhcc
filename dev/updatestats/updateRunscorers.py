# This assumes that the AllTimeBatting has already been updated

# Run by running `python dev/updatestats/updateRunscorers.py`

import csv
import sys

alltime_stats = []
pc_stats = []

with open('stats/AllTimeBatting.csv', newline='') as existing:
    reader = csv.reader(existing, delimiter=',')
    for row in reader:
        alltime_stats.append(row)
header = alltime_stats.pop(0)

topBatters = []

for player in alltime_stats:
    if player[5] != '' and int(player[5]) >= 1000:
        topBatters += [player]


# Sort by runs
def sortByRuns(player):
    return -int(player[5])


topBatters.sort(key=sortByRuns)

# Write back to stats/AllTimeRunscorer.csv
with open('stats/AllTimeRunscorer.csv', 'w', newline='') as alltime:
    writer = csv.writer(alltime, delimiter=',')
    writer.writerow(header)
    for row in topBatters:
        writer.writerow(row)
