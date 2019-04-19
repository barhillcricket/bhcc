function createStatsTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      if (i % 2 === 1) {
        newRow.className = 'alternative';
      }
      Object.keys(row).forEach(function(val, index) {
        const newText = document.createTextNode(row[val]);
        const newCell = newRow.insertCell(index);
        newCell.appendChild(newText);
        if (index > 1) {
          newCell.align = 'center';
        } else {
          newCell.height = '20';
        }
      });
    });
  });
}

function createPartnershipsTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      if (i % 2 === 1) {
        newRow.className = 'alternative';
      }
      Object.keys(row).forEach(function(val, index) {
        const newText = document.createTextNode(row[val]);
        const newCell = newRow.insertCell(index);
        newCell.appendChild(newText);
        if (index < 2 || index === 7) {
          newCell.align = 'center';
          newCell.height = '20';
        }
      });
    });
  });
}

function createLeagueTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      if (i % 2 === 1) {
        newRow.className = 'alternative';
      }
      Object.keys(row).forEach(function(val, index) {
        const newText = document.createTextNode(row[val]);
        const newCell = newRow.insertCell(index);
        newCell.appendChild(newText);
        if (index === 0) {
          newCell.height = '20';
        } else {
          newCell.align = 'center';
        }
      });
    });
  });
}
