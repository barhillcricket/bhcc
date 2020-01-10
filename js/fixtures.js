function loadFixtures(year, cb) {
  return d3.json('/archive/' + year + '/fixtures.txt', cb);
}

function homePageTable(year, team, id) {
  var table = document.getElementById(id);
  loadFixtures(year, function(fixtures) {
    fixtures.forEach(function(f) {
      if (f.team[0].toLowerCase() === team) {
        const newRow = table.insertRow(-1);
        var dateStr = f.date.slice(0,5);
        if (dateStr[3] === '0') {
          dateStr = dateStr.slice(0,3) + dateStr[4];
        }
        if (dateStr[0] === '0') {
          dateStr = dateStr.slice(1);
        }
        const dateCell = newRow.insertCell(0);
        dateCell.appendChild(document.createTextNode(dateStr));
        const resultCell = newRow.insertCell(1);
        resultCell.appendChild(document.createTextNode(f.result));
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