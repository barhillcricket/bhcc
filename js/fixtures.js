function loadFixtures(year, cb) {
  return d3.json('/archive/' + year + '/fixtures.txt', cb);
}

function parseFixtureDate(dateStr) {
  if (!dateStr) return null;
  var d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  // dd/mm/yyyy or mm/dd style fallbacks
  var parts = String(dateStr).split(/[\/\-]/);
  if (parts.length === 3) {
    var a = parseInt(parts[0], 10);
    var b = parseInt(parts[1], 10);
    var c = parseInt(parts[2], 10);
    if (c < 100) c += 2000;
    // Prefer ISO-like yyyy-mm-dd already handled; assume d/m/y for GB
    if (String(dateStr).indexOf('-') === -1 && a <= 31) {
      d = new Date(c, b - 1, a);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

function isUpcomingFixture(f, now) {
  var d = parseFixtureDate(f.date);
  if (!d) return !f.result || f.result === '-' || f.result === '';
  var day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return day >= today;
}

function formatHomeDate(dateStr) {
  var dateShort = String(dateStr).slice(-5);
  if (String(dateStr).indexOf('/') !== -1) {
    dateShort = dateShort.slice(-2) + '/' + dateShort.slice(0, 2);
    if (dateShort[3] === '0') {
      dateShort = dateShort.slice(0, 3) + dateShort[4];
    }
    if (dateShort[0] === '0') {
      dateShort = dateShort.slice(1);
    }
    return dateShort;
  }
  return dateStr;
}

function formatHomeResult(resultStr) {
  resultStr = resultStr || '';
  if (resultStr.slice(0, 5) === 'Conc.') {
    return resultStr.slice(6);
  }
  if (resultStr.length > 5) {
    return resultStr.slice(0, 4) + '.';
  }
  return resultStr;
}

function matchesTeam(f, team) {
  if (!team || team === 'all') return true;
  var t = (f.team || '').toLowerCase();
  return t[0] === team || t === team;
}

function matchesVenue(f, venue) {
  if (!venue || venue === 'all') return true;
  var v = (f.homeaway || '').toLowerCase();
  if (venue === 'h') return v === 'h' || v.indexOf('home') === 0;
  if (venue === 'a') return v === 'a' || v.indexOf('away') === 0;
  return true;
}

function homePageTable(year, team, id) {
  var table = document.getElementById(id);
  if (!table) return;
  loadFixtures(year, function (fixtures) {
    fixtures.forEach(function (f) {
      if (!matchesTeam(f, team)) return;
      var newRow = table.insertRow(-1);
      newRow.setAttribute('data-venue', (f.homeaway || '').toLowerCase().charAt(0));
      newRow.setAttribute('data-upcoming', isUpcomingFixture(f, new Date()) ? '1' : '0');

      var dateCell = newRow.insertCell(0);
      dateCell.appendChild(document.createTextNode(formatHomeDate(f.date)));
      var resultCell = newRow.insertCell(1);
      resultCell.appendChild(document.createTextNode(formatHomeResult(f.result)));
      var oppositionCell = newRow.insertCell(2);
      oppositionCell.appendChild(
        document.createTextNode(
          f.opposition + (String(f.competition).toLowerCase().indexOf('cup') !== -1 ? ' (Cup)' : '')
        )
      );
      var homeawayCell = newRow.insertCell(3);
      homeawayCell.appendChild(document.createTextNode(f.homeaway));
      dateCell.align = 'center';
      resultCell.align = 'center';
      homeawayCell.align = 'center';
    });
  });
}

function getDateString(d) {
  var date = new Date(d);
  if (isNaN(date)) return d;
  return getNumberWithOrdinal(date.getDate()) + ' ' + Intl.DateTimeFormat('en-GB', {
    month: 'long'
  }).format(date);
}

function getNumberWithOrdinal(n) {
  var s = ['th', 'st', 'nd', 'rd'];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function clearTableBody(table) {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  // If header is in thead, wipe tbody
  var tbody = table.tBodies[0];
  if (tbody && table.tHead) {
    tbody.innerHTML = '';
  }
}

function seasonPageTable(year, id, options) {
  options = options || {};
  var table = document.getElementById(id);
  if (!table) return;

  loadFixtures(year, function (fixtures) {
    renderSeasonFixtures(table, fixtures, options);
    table._fixturesCache = fixtures;
    table._fixturesYear = year;
    initSeasonFilters(id);
  });
}

function renderSeasonFixtures(table, fixtures, options) {
  options = options || {};
  var team = options.team || 'all';
  var venue = options.venue || 'all';
  var upcomingOnly = !!options.upcomingOnly;
  var group = options.group !== false;
  var now = new Date();
  var body = table.tBodies[0] || table;

  if (table.tBodies[0]) {
    table.tBodies[0].innerHTML = '';
  } else {
    while (table.rows.length > 1) table.deleteRow(1);
  }

  var filtered = fixtures.filter(function (f) {
    if (!matchesTeam(f, team)) return false;
    if (!matchesVenue(f, venue)) return false;
    if (upcomingOnly && !isUpcomingFixture(f, now)) return false;
    return true;
  });

  function addRow(f) {
    var newRow = body.insertRow(-1);
    newRow.className = isUpcomingFixture(f, now) ? 'fixture-upcoming' : 'fixture-past';
    var dateCell = newRow.insertCell(0);
    dateCell.appendChild(document.createTextNode(getDateString(f.date)));
    var oppositionCell = newRow.insertCell(1);
    oppositionCell.appendChild(document.createTextNode(f.opposition));
    var homeawayCell = newRow.insertCell(2);
    homeawayCell.appendChild(document.createTextNode(f.homeaway));
    var teamCell = newRow.insertCell(3);
    teamCell.appendChild(document.createTextNode(f.team));
    var competitionCell = newRow.insertCell(4);
    competitionCell.appendChild(document.createTextNode(f.competition));
    var resultCell = newRow.insertCell(5);
    resultCell.appendChild(document.createTextNode(f.result ? f.result : '-'));
    dateCell.align = 'center';
    oppositionCell.align = 'center';
    homeawayCell.align = 'center';
    teamCell.align = 'center';
    competitionCell.align = 'center';
    resultCell.align = 'center';
  }

  if (!group) {
    filtered.forEach(addRow);
    return;
  }

  var upcoming = [];
  var past = [];
  filtered.forEach(function (f) {
    if (isUpcomingFixture(f, now)) upcoming.push(f);
    else past.push(f);
  });

  function addGroupLabel(label) {
    var row = body.insertRow(-1);
    row.className = 'fixture-group-row';
    var cell = row.insertCell(0);
    cell.colSpan = 6;
    cell.innerHTML = '<div class="fixture-group-label">' + label + '</div>';
  }

  if (upcoming.length) {
    addGroupLabel('Upcoming');
    upcoming.forEach(addRow);
  }
  if (past.length) {
    addGroupLabel('Results');
    past.forEach(addRow);
  }
  if (!upcoming.length && !past.length) {
    var empty = body.insertRow(-1);
    var emptyCell = empty.insertCell(0);
    emptyCell.colSpan = 6;
    emptyCell.textContent = 'No fixtures match these filters.';
    emptyCell.align = 'center';
  }
}

function applySeasonFilters(tableId) {
  var table = document.getElementById(tableId);
  if (!table || !table._fixturesCache) return;
  var teamEl = document.getElementById('filter-team');
  var venueEl = document.getElementById('filter-venue');
  var upcomingEl = document.getElementById('filter-upcoming');
  renderSeasonFixtures(table, table._fixturesCache, {
    team: teamEl ? teamEl.value : 'all',
    venue: venueEl ? venueEl.value : 'all',
    upcomingOnly: upcomingEl ? upcomingEl.checked : false,
    group: true
  });
}

function initSeasonFilters(tableId) {
  if (document.documentElement.getAttribute('data-season-filters') === tableId) return;
  document.documentElement.setAttribute('data-season-filters', tableId);
  ['filter-team', 'filter-venue', 'filter-upcoming'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function () {
      applySeasonFilters(tableId);
    });
  });
}

function applyHomeFixtureFilters(panel) {
  var upcomingOnly = panel.querySelector('#home-filter-upcoming');
  var venueEl = panel.querySelector('#home-filter-venue');
  var upcoming = upcomingOnly ? upcomingOnly.checked : false;
  var venue = venueEl ? venueEl.value : 'all';

  panel.querySelectorAll('table.fixtures tr').forEach(function (row, idx) {
    if (idx === 0 && row.querySelector('th')) return;
    if (!row.cells || row.cells.length < 2) return;
    var show = true;
    if (upcoming && row.getAttribute('data-upcoming') !== '1') show = false;
    if (venue !== 'all') {
      var v = (row.getAttribute('data-venue') || '').charAt(0);
      if (v !== venue) show = false;
    }
    row.style.display = show ? '' : 'none';
  });
}

function initHomeFixtureFilters() {
  var panel = document.querySelector('.fixtures-panel');
  if (!panel) return;
  ['home-filter-upcoming', 'home-filter-venue'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function () {
      applyHomeFixtureFilters(panel);
    });
  });
  // Re-apply after async table fills
  setTimeout(function () {
    applyHomeFixtureFilters(panel);
  }, 800);
}
