# Provide the Play Cricket download for the season's stats in archive/<year>/stats/batting<year>.csv
# e.g. archive/2024/stats/batting2024.csv

import csv
import sys

alltime_stats = []
pc_stats = []

with open('newstats/AllTimeBatting.csv', newline='') as existing:
    reader = csv.reader(existing, delimiter=',')
    for row in reader:
        alltime_stats.append(row)
header = alltime_stats.pop(0)
year = sys.argv[1]

with open("archive/{year}/newstats/batting{year}.csv".format(year=year), newline='') as pc:
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
        for c in [2, 3, 4, 5, 9, 10]:
            if alltime_player_stats[c]:
                alltime_player_stats[c] = int(alltime_player_stats[c]) + int(pc_stats[i][c])
        # Update high score
        if pc_stats[i][6] and (int(pc_stats[i][6]) > int(alltime_player_stats[6])) or alltime_player_stats[6] == '':
            alltime_player_stats[6] = pc_stats[i][6]
            alltime_player_stats[7] = pc_stats[i][7]
        # Edge case if matched HS but NO
        if pc_stats[i][6] and int(alltime_player_stats[6]) == int(pc_stats[i][6]):
            if pc_stats[i][7] == "Yes":
                alltime_player_stats[7] = "Yes"
        # Update AVG
        if int(alltime_player_stats[3]) == int(alltime_player_stats[4]):
            alltime_player_stats[8] = int(alltime_player_stats[5])
        alltime_player_stats[8] = '{0:.2f}'.format(int(alltime_player_stats[5])/(int(alltime_player_stats[3]) - int(alltime_player_stats[4])))
    else:
        if pc_stats[i][8] == '-':
            pc_stats[i][8] = '----'
        else:
            pc_stats[i][8] = '{0:.2f}'.format(float(pc_stats[i][8]))
        pc_stats[i][0] = 0
        new_name = str(pc_stats[i][1]).split(' ')
        pc_stats[i][1] = new_name[0][0].capitalize() + ' ' + (' '.join(new_name[1:])).title()
        alltime_stats += [pc_stats[i]]


# Sort by avg
def sortByAvg(player):
    if player[8] == '----':
        return 1
    return -float(player[8])


alltime_stats.sort(key=sortByAvg)

# Write back to newstats/AllTimeBatting.csv
with open('newstats/AllTimeBatting.csv', 'w', newline='') as alltime:
    writer = csv.writer(alltime, delimiter=',')
    writer.writerow(header)
    for row in alltime_stats:
        writer.writerow(row)
