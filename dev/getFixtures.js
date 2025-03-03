const request = require('request');
const fs = require('fs');

const year = process.argv[2];
const token = process.argv[3];
const outfile = `archive/${year}/fixtures.txt`;
const matches = [];
const clubId = "909"
const teamIds = {
    "13032": "1st XI",
    "12857": "Friendly",
    "257099": "2nd XI",
    "211943": "Midweek"
}
const competitionIds = {
    "101152": "CCA 4W",
    "117813": "CCA 4W"
    "88390": "CCA 3W",
    "": "Friendly",
    "106878": "CBHL 3",
    "122137": "CBHL 3"
}

const resolveHome = (match) => {
    return match.home_club_id === clubId
}

const resolveTeam = (match, home) => {
    return teamIds[match[`${home ? 'home' : 'away'}_team_id`]]
}

const resolveOpposition = (match, home) => {
    var oppTeamText = ''
    switch (match[`${home ? 'away' : 'home'}_team_name`][0]) {
        case '2':
            oppTeamText = ' II';
            break;
        case '3':
            oppTeamText = ' III';
            break;
        case '4':
            oppTeamText = ' IV';
            break;
        case '5':
            oppTeamText = ' V';
            break;
        case '6':
            oppTeamText = ' VI';
            break;
    }
    var clubName = match[`${home ? 'away' : 'home'}_club_name`] || match[`${home ? 'away' : 'home'}_team_name`]
    clubName = clubName.replace(', Cambs', '')
    clubName = clubName.replace(' CC', '')
    return clubName + oppTeamText
}

const resolveResult = (match, home) => {
    const teamId = match[`${home ? 'home' : 'away'}_team_id`];
    if (match.result === 'W') {
        return match.result_applied_to === teamId ? 'Won' : 'Lost'
    } else if (match.result === '') {
        return ""
    } else if (match.result === 'C') {
        return "Cancelled"
    } else if (match.result === 'A') {
        return "Abandoned"
    }
}

const resolveDate = (match) => {
    const dateSegs = match.match_date.split('/')
    return dateSegs.reverse().join('/')
}

request(`https://play-cricket.com/api/v2/matches.json?&site_id=909&season=${year}&api_token=${token}`, (err, res, body) => {
    const matchesJson = JSON.parse(body).matches;
    const promises = [];
    matchesJson.map((match) => {
        promises.push(new Promise((resolve) => {
            request(`https://play-cricket.com/api/v2/match_detail.json?&match_id=${match.id}&api_token=${token}`, (err, res, body) => {
                const matchJson = JSON.parse(body).match_details[0];
                const isHome = resolveHome(matchJson);
                const newMatch = {
                    "team": resolveTeam(matchJson, isHome),
                    "opposition": resolveOpposition(matchJson, isHome),
                    "date": resolveDate(matchJson),
                    "homeaway": isHome ? 'H' : 'A',
                    "result": resolveResult(matchJson, isHome),
                    "competition": competitionIds[matchJson.competition_id] ? competitionIds[matchJson.competition_id] : matchJson.competition_id
                }
                matches.push(newMatch)
                resolve(true)
            })
        }))
        Promise.all(promises).then(() => {
            function compareDate( a, b ) {
                if ( a.date < b.date ){
                  return -1;
                }
                if ( a.date > b.date ){
                  return 1;
                }
                return 0;
            }

            fs.writeFile(outfile, JSON.stringify(matches.sort(compareDate), null, 2), err => {
                if (err) {
                    console.error(err)
                }
            })
        })
    })
})
