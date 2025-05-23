function createStatsTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    table.className = 'generated';
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      Object.keys(row).forEach(function(val, index) {
        if (val.charAt(0) !== 'x') {
          const newText = document.createTextNode(row[val]);
          const newCell = newRow.insertCell(index);
          newCell.appendChild(newText);
          if (index > 1) {
            newCell.align = 'center';
          } else {
            newCell.height = '20';
          }
        }
      });
    });
  });
}

function createAllTimeLeaderTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    table.className = 'generated';
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      Object.keys(row).forEach(function(val, index) {
        if (index != 0) {
          if (index == 7 && tableId === 'batting-all') {
            if (row[val] === 'Yes') newRow.cells[5].childNodes[0].textContent += '*'
          } else {
            const newText = document.createTextNode(row[val]);
            const newCell = newRow.insertCell(index < 8 || tableId !== 'batting-all' ? index - 1 : index - 2);
            newCell.appendChild(newText);
            if (index > 1) {
              newCell.align = 'center';
            } else {
              newCell.height = '20';
            }
          }
        }
      })
    });
  });
}

function createAllTimeStatsTable(csvFile, tableId, sortField, min, type, next) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    table.className = 'generated';
    table.innerHTML = null;
    document.getElementById(type+ '-more').hidden = next === 'less';
    document.getElementById(type+ '-less').hidden = next === 'more';
    document.getElementById(type + '-qual').hidden = next === 'less';
    var skipped = 0;
    data.forEach(function(row, i) {
      if (row[Object.keys(row)[sortField]] >= min) {
        const newRow = table.insertRow(-1);
        newRow.height = '20';
        Object.keys(row).forEach(function(val, index) {
          if (index !== 0 || type == 'match') {
            if (index == 7 && type === 'bat') {
              if (row[val] === 'Yes') newRow.cells[5].childNodes[0].textContent += '*'
            } else {
              const newText = (type == 'bowl' && val.charAt(0) == '9') ? document.createTextNode((parseFloat(row[val])*6/100).toFixed(2)) : document.createTextNode(row[val]);
              const newCell = newRow.insertCell(type == 'match' ? index : (index < 8 || type !== 'bat' ? index - 1 : index - 2));
              newCell.appendChild(newText);
              if (index > 1 || type == 'match' && index > 0) {
                newCell.align = 'center';
              } else {
                newCell.height = '20';
              }
            }
          }
        });
      } else {
        skipped++;
      }
    });
  });
}

function createPartnershipsTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    const table = document.getElementById(tableId);
    table.className = 'generated';
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      Object.keys(row).forEach(function(val, index) {
        const newText = document.createTextNode(row[val]);
        const newCell = newRow.insertCell(index);
        newCell.appendChild(newText);
        if (index < 4 || index === 7) {
          newCell.align = 'center';
          newCell.height = '20';
        }
      });
    });
  });
}

function createLeagueTable(csvFile, tableId) {
  d3.csv(csvFile, function(data) {
    if (Object.keys(data[0]).length === 13) {
      return createLeagueTableFromPlayCricket(data, tableId);
    }
    const table = document.getElementById(tableId);
    table.className = 'generated';
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
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

function createLeagueTableFromPlayCricket(data, tableId) {
    const table = document.getElementById(tableId);
    table.className = 'generated';
    data.forEach(function(row, i) {
      const newRow = table.insertRow(-1);
      newRow.height = '20';
      for (i=0; i <= 8; i++) {
        const key = Object.keys(row).find(function(k) {
          return k.charAt(0) == i;
        });
        const newText = document.createTextNode(row[key]);
        const newCell = newRow.insertCell(i);
        newCell.appendChild(newText);
        if (i === 0) {
          newCell.height = '20';
        } else {
          newCell.align = 'center';
        }
      }
    });
}
