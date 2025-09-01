# Provide the Play Cricket download for the season's stats in archive/<year>/stats/bowling<year>.csv
# e.g. archive/2024/stats/bowling2024.csv

# Run by running `python dev/updatestats/updateBowlingStats.py 2024`

import csv
import sys
import math

alltime_stats = []
pc_stats = []

with open('stats/AllTimeBowling.csv', newline='') as existing:
    reader = csv.reader(existing, delimiter=',')
    for row in reader:
        alltime_stats.append(row)
header = alltime_stats.pop(0)
year = sys.argv[1]

with open("archive/{year}/stats/bowling{year}.csv".format(year=year), newline='') as pc:
    reader = csv.reader(pc, delimiter=',')
    for row in reader:
        pc_stats.append(row)
pc_stats.pop(0)

# Need the batting stats to grab the matches
batting_stats = []
with open("archive/{year}/stats/batting{year}.csv".format(year=year), newline='') as pc:
    reader = csv.reader(pc, delimiter=',')
    for row in reader:
        batting_stats.append(row)
batting_stats.pop(0)


def get_name_alltime(row):
    return row[1]


def get_name_pc(row):
    name = row[1].split(' ')
    name[0] = name[0][0]
    return ' '.join(name).title()


names_alltime = list(map(get_name_alltime, alltime_stats))
names_batting = list(map(get_name_pc, batting_stats))

for i, name in enumerate(list(map(get_name_pc, pc_stats))):
    # Get number of matches from batting stats
    batting_index = names_batting.index(name)
    matches = batting_stats[batting_index][2]
    pc_stats[i] = pc_stats[i][0:2] + [matches] + pc_stats[i][2:]

    if name in names_alltime:
        # Match up pc with alltime and add together the stats
        alltime_index = names_alltime.index(name)
        alltime_player_stats = alltime_stats[alltime_index]
        # Add to totals
        for c in [2, 4, 5, 6, 8]:
            if alltime_player_stats[c]:
                alltime_player_stats[c] = int(alltime_player_stats[c]) + int(pc_stats[i][c])
        # Update overs
        overs = pc_stats[i][3].split('.')
        if len(overs) == 1:
            alltime_player_stats[3] = float(alltime_player_stats[3]) + float(overs[0])
        else:
            alltime_overs = alltime_player_stats[3].split('.')
            if len(alltime_overs) == 1:
                alltime_overs += ['0']
            balls = int(overs[1]) + int(alltime_overs[1])
            if balls >= 6:
                balls -= 6
                alltime_overs[0] = int(alltime_overs[0]) + 1
            alltime_player_stats[3] = float(alltime_overs[0]) + float(overs[0]) + balls/10
        alltime_player_stats[3] = '{0:.1f}'.format(alltime_player_stats[3])

        # Update best bowling
        [wickets, runs] = pc_stats[i][7].split('/')
        [alltime_wickets, alltime_runs] = alltime_player_stats[7].split('/')
        if int(wickets) > int(alltime_wickets) or int(wickets) == int(alltime_wickets) and int(runs) < int(alltime_runs):
            alltime_player_stats[7] = pc_stats[i][7]

        # Update Economy (runs/over)
        overs = float(alltime_player_stats[3])
        total_balls = math.floor(overs) * 6 + (overs * 10) % 10
        alltime_player_stats[9] = '{0:.2f}'.format(int(alltime_player_stats[5]) / (total_balls / 6))

        # Update Strike Rate (balls/wicket)
        if int(alltime_player_stats[6]) == 0:
            alltime_player_stats[10] = '-----'
        else:
            alltime_player_stats[10] = '{0:.2f}'.format(total_balls / int(alltime_player_stats[6]))

        # Update Average (runs/wicket)
        if int(alltime_player_stats[6]) == 0:
            alltime_player_stats[11] = '-----'
        else:
            alltime_player_stats[11] = '{0:.2f}'.format(int(alltime_player_stats[5]) / int(alltime_player_stats[6]))

    else:
        pc_stats[i][9] = '{0:.2f}'.format(float(pc_stats[i][9]))
        if pc_stats[i][10] == '-':
            pc_stats[i][10] = '-----'
        else:
            pc_stats[i][10] = '{0:.2f}'.format(float(pc_stats[i][10]))
        if pc_stats[i][11] == '-':
            pc_stats[i][11] = '-----'
        else:
            pc_stats[i][11] = '{0:.2f}'.format(float(pc_stats[i][11]))
        pc_stats[i][0] = 0
        new_name = str(pc_stats[i][1]).split(' ')
        pc_stats[i][1] = new_name[0][0].capitalize() + ' ' + (' '.join(new_name[1:])).title()
        if pc_stats[i][8] == '0':
            pc_stats[i][8] = ''
        pc_stats[i] += ['']
        alltime_stats += [pc_stats[i]]

# Update matches for players who didn't bowl this season
for i, name in enumerate(names_batting):
    if name not in list(map(get_name_pc, pc_stats)) and name in names_alltime:
        alltime_index = names_alltime.index(name)
        alltime_stats[alltime_index][2] = int(alltime_stats[alltime_index][2]) + int(batting_stats[i][2])


# Sort by avg
def sortByAvg(player):
    if player[11] == '-----':
        return 999999999
    return float(player[11])


alltime_stats.sort(key=sortByAvg)

# Write back to stats/AllTimeBowling.csv
with open('stats/AllTimeBowling.csv', 'w', newline='') as alltime:
    writer = csv.writer(alltime, delimiter=',')
    writer.writerow(header)
    for row in alltime_stats:
        writer.writerow(row)
