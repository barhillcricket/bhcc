# Provide the Play Cricket download for the season's stats in archive/<year>/stats/catches<year>.csv
# e.g. archive/2024/stats/catches2024.csv

# Run by running `python dev/updatestats/updateCatchingStats.py 2025`

import csv
import sys
import math

alltime_stats = []
pc_stats = []

with open('stats/AllTimeCatches.csv', newline='') as existing:
    reader = csv.reader(existing, delimiter=',')
    for row in reader:
        alltime_stats.append(row)
header = alltime_stats.pop(0)
year = sys.argv[1]

with open("archive/{year}/stats/catches{year}.csv".format(year=year), newline='') as pc:
    reader = csv.reader(pc, delimiter=',')
    for row in reader:
        pc_stats.append(row)
pc_stats.pop(0)


def get_name_alltime(row):
    return row[1]


def get_name_pc(row):
    name = row[1].split(' ')
    name[0] = name[0][0]
    return ' '.join(name).title()


names_alltime = list(map(get_name_alltime, alltime_stats))

for i, name in enumerate(list(map(get_name_pc, pc_stats))):

    if name in names_alltime:
        # Match up pc with alltime and add together the stats
        alltime_index = names_alltime.index(name)
        alltime_player_stats = alltime_stats[alltime_index]
        # Add to totals
        for c in [2, 3, 4]:
            if alltime_player_stats[c]:
                alltime_player_stats[c] = int(alltime_player_stats[c]) + int(pc_stats[i][c])
    else:
        pc_stats[i][0] = 0
        new_name = str(pc_stats[i][1]).split(' ')
        pc_stats[i][1] = new_name[0][0].capitalize() + ' ' + (' '.join(new_name[1:])).title()
        for c in [2, 3]:
            if pc_stats[i][c] == '0':
                pc_stats[i][c] = ''
        pc_stats[i] += ['']
        alltime_stats += [pc_stats[i]]


# Sort by total
def sortByTotal(player):
    return -int(player[4])


alltime_stats.sort(key=sortByTotal)

# Write back to stats/AllTimeCatches.csv
with open('stats/AllTimeCatches.csv', 'w', newline='') as alltime:
    writer = csv.writer(alltime, delimiter=',')
    writer.writerow(header)
    for row in alltime_stats:
        writer.writerow(row)
