# Provide the Play Cricket download for the season's stats in archive/<year>/stats/batting<year>.csv
# e.g. archive/2024/stats/batting2024.csv

import csv
import sys

alltime_stats = []
pc_stats = []

with open('newstats/AllTimeMatches.csv', newline='') as existing:
    reader = csv.reader(existing, delimiter=',')
    for row in reader:
        alltime_stats.append(row)
header = alltime_stats.pop(0)
year = sys.argv[1]

with open("archive/{year}/stats/batting{year}.csv".format(year=year), newline='') as pc:
    reader = csv.reader(pc, delimiter=',')
    for row in reader:
        pc_stats.append(row)
pc_stats.pop(0)


def get_name_alltime(row):
    return row[0]


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
        alltime_player_stats[1] = int(alltime_player_stats[1]) + int(pc_stats[i][2])
    else:
        new_name = str(pc_stats[i][1]).split(' ')
        pc_stats[i][1] = new_name[0][0].capitalize() + ' ' + (' '.join(new_name[1:])).title()
        alltime_stats += [[pc_stats[i][1], pc_stats[i][2], '']]


# Sort by matches
def sortByMatches(player):
    return -int(player[1])


alltime_stats.sort(key=sortByMatches)

# Write back to newstats/AllTimeMatches.csv
with open('newstats/AllTimeMatches.csv', 'w', newline='') as alltime:
    writer = csv.writer(alltime, delimiter=',')
    writer.writerow(header)
    for row in alltime_stats:
        writer.writerow(row)
