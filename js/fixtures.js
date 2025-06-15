function loadFixtures(year, cb) {
  return d3.json('/archive/' + year + '/fixtures.txt', cb);
}

function homePageTable(year, team, id) {
  var table = document.getElementById(id);
  loadFixtures(year, function(fixtures) {
    fixtures.forEach(function(f) {
      if (f.team[0].toLowerCase() === team || f.team.toLowerCase() === team) {
        const newRow = table.insertRow(-1);
        var dateStr = f.date.slice(-5);
        if (f.date.includes('/')) {
          dateStr = dateStr.slice(-2) + '/' + dateStr.slice(0,2);
          if (dateStr[3] === '0') {
            dateStr = dateStr.slice(0,3) + dateStr[4];
          }
          if (dateStr[0] === '0') {
            dateStr = dateStr.slice(1);
          }
        } else {
          dateStr = f.date
        }
        const dateCell = newRow.insertCell(0);
        dateCell.appendChild(document.createTextNode(dateStr));
        const resultCell = newRow.insertCell(1);
        var resultStr = f.result;
        if (resultStr.slice(0,5) === 'Conc.') {
          resultStr = resultStr.slice(6);
        } else if (resultStr.length > 5) {
          resultStr = resultStr.slice(0,4) + '.'
        }
        resultCell.appendChild(document.createTextNode(resultStr));
        const oppositionCell = newRow.insertCell(2);
        oppositionCell.appendChild(document.createTextNode(f.opposition));
        const homeawayCell = newRow.insertCell(3);
        homeawayCell.appendChild(document.createTextNode(f.homeaway));
        dateCell.align = 'center';
        resultCell.align = 'center';
        homeawayCell.align = 'center';
      }
    })
  })
}

function getDateString(d) {
  var date = new Date(d);
  if (isNaN(date)) return d;
  return getNumberWithOrdinal(date.getDate()) + ' ' + Intl.DateTimeFormat('en-GB', {
    month: 'long'
  }).format(date);
}

function seasonPageTable(year, id) {
  var table = document.getElementById(id);
  loadFixtures(year, function(fixtures) {
    fixtures.forEach(function(f) {
      const newRow = table.insertRow(-1);
      const dateCell = newRow.insertCell(0);
      dateCell.appendChild(document.createTextNode(getDateString(f.date)));
      const oppositionCell = newRow.insertCell(1);
      oppositionCell.appendChild(document.createTextNode(f.opposition));
      const homeawayCell = newRow.insertCell(2);
      homeawayCell.appendChild(document.createTextNode(f.homeaway));
      const teamCell = newRow.insertCell(3);
      teamCell.appendChild(document.createTextNode(f.team));
      const competitionCell = newRow.insertCell(4);
      competitionCell.appendChild(document.createTextNode(f.competition));
      const resultCell = newRow.insertCell(5);
      resultCell.appendChild(document.createTextNode(f.result ? f.result : '-'));
      dateCell.align = 'center';
      oppositionCell.align = 'center';
      homeawayCell.align = 'center';
      teamCell.align = 'center';
      competitionCell.align = 'center';
      resultCell.align = 'center';
    })
  })
}