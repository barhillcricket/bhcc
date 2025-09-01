# This assumes that the AllTimeBowling has already been updated

# Run by running `python dev/updatestats/updateWicketTakers.py`

import csv
import sys

alltime_stats = []
pc_stats = []

with open('stats/AllTimeBowling.csv', newline='') as existing:
    reader = csv.reader(existing, delimiter=',')
    for row in reader:
        alltime_stats.append(row)
alltime_stats.pop(0)

topBowlers = []

for p in alltime_stats:
    if int(p[6]) >= 100:
        topBowlers += [[p[0], p[1], p[2], p[3], p[4], p[6], p[5], p[7], p[11]]]


# Sort by wickets
def sortByWickets(player):
    return -int(player[5])


topBowlers.sort(key=sortByWickets)

# Write back to stats/AllTimeWicket.csv
with open('stats/AllTimeWicket.csv', 'w', newline='') as alltime:
    writer = csv.writer(alltime, delimiter=',')
    writer.writerow(["Rank", "Player", "Matches", "Overs", "Mdn", "Wkt", "Runs", "Best", "Ave"])
    for row in topBowlers:
        writer.writerow(row)
