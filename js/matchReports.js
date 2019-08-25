function loadReports(year, cb) {
  return d3.json('/archive/' + year + '/matchReports.txt', cb);
}

function getNumberWithOrdinal(n) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getDateString(d) {
  var date = new Date(d);
  return Intl.DateTimeFormat('en-GB', {
    weekday: 'long'
  }).format(date) + ' ' + getNumberWithOrdinal(date.getDate()) + ' ' + Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function getLatestReports(year, id) {
  var section = document.getElementById(id);
  loadReports(year, function (reports) {
    reports = reports.slice(-5).reverse()
    reports.forEach(function (report) {
      var rep = section.appendChild(document.createElement("p"));
      var title = rep.appendChild(document.createElement('strong'));
      title.innerHTML = getDateString(report.date) + ' - ' + (report.home ? 'Bar Hill v ' + report.opposition : report.opposition + ' v Bar Hill');
      if (report.scorecard_link) {
        var dash = rep.appendChild(document.createElement('span'));
        dash.innerHTML = ' - ';
        var link = rep.appendChild(document.createElement('a'));
        link.href = report.scorecard_link;
        link.innerText = 'Scorecard'
      }
      rep.appendChild(document.createElement('br'));
      var reportText = rep.appendChild(document.createElement('div'));
      reportText.innerHTML = report.report;
    })
  });
}

function getSeasonReports(year, id) {
  var section = document.getElementById(id);
  loadReports(year, function (reports) {
    reports.forEach(function (report) {
      var rep = section.appendChild(document.createElement("p"));
      var title = rep.appendChild(document.createElement('strong'));
      title.innerHTML = getDateString(report.date) + ' - ' + (report.home ? 'Bar Hill v ' + report.opposition : report.opposition + ' v Bar Hill');
      if (report.scorecard_link) {
        var dash = rep.appendChild(document.createElement('span'));
        dash.innerHTML = ' - ';
        var link = rep.appendChild(document.createElement('a'));
        link.href = report.scorecard_link;
        link.innerText = 'Scorecard'
      }
      rep.appendChild(document.createElement('br'));
      var reportText = rep.appendChild(document.createElement('div'));
      reportText.innerHTML = report.report;
    })
  });
}