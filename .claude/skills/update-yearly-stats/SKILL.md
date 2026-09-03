---
name: update-yearly-stats
description: Update the club's all-time cricket stats (batting, bowling, matches, catching, runscorers, wicket-takers) with the current season's Play Cricket data. Use when the user asks to "update stats", "update this year's stats", or similar, referring to the scripts in dev/updatestats.
---

# Update yearly stats

Runs the season-end stats update using the Python scripts in `dev/updatestats/`.
Use the **current calendar year** as the year argument unless the user specifies otherwise.

## Prerequisites

Before running anything, confirm the Play Cricket season download files exist:

- `archive/<year>/stats/batting<year>.csv`
- `archive/<year>/stats/bowling<year>.csv`
- `archive/<year>/stats/catches<year>.csv`

If any are missing, stop and ask the user to add the Play Cricket export for that file before continuing — do not fabricate or skip the data.

## Run order

The scripts must be run in this order because later ones depend on files earlier ones produce or update:

```
python3 dev/updatestats/updateBattingStats.py <year>
python3 dev/updatestats/updateBowlingStats.py <year>
python3 dev/updatestats/updateMatches.py <year>
python3 dev/updatestats/updateCatchingStats.py <year>
python3 dev/updatestats/updateRunscorers.py
python3 dev/updatestats/updateWicketTakers.py
```

Notes:
- `updateBowlingStats.py` and `updateMatches.py` also read that year's `batting<year>.csv`, so batting must run first.
- `updateRunscorers.py` and `updateWicketTakers.py` take no year argument — they just re-derive the leaderboards from the already-updated `stats/AllTimeBatting.csv` / `stats/AllTimeBowling.csv`, so they must run last.
- All scripts write in place to the `stats/AllTime*.csv` files; run each exactly once per year.

## After running

Run `git status --short` and summarize which `stats/AllTime*.csv` files changed. Do not commit the changes unless the user explicitly asks.

## Link the new season from the archive page

`archive.html` has a "Previous Seasons" list (search for `previousseasons`) linking to each year's
`archive/<year>/archive<year>.html`. Add a new entry for `<year>` at the **top** of that list (most
recent season first), matching the existing format:

```html
<a href="archive/<year>/archive<year>.html"><year> Season</a><br>
```

Only add this if `archive/<year>/archive<year>.html` already exists — if it doesn't, tell the user
that page needs creating first rather than linking to a page that doesn't exist.

## Demo the result

To show the updated stats and new archive link working:

1. Start a static server from the repo root: `http-server -p 8080` (run in background — it does not exit on its own).
2. Confirm it's serving: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/archive.html` should return `200`.
3. Open it in Chrome: `open -a "Google Chrome" "http://127.0.0.1:8080/archive.html"`.
