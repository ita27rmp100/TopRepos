// needed packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const topReposRouter = require('./routes/country');

// ─── Firestore updater imports ────────────────────────────────────────────────
const { configuration, uploadProcessData } = require('./crud');
const HOURS_48 = 48 * 60 * 60 * 1000;
const breakFetch = 60 * 60 * 1000
const countries = [
  "algeria", "argentina", "australia", "belgium", "brazil",
  "canada", "china", "egypt", "ethiopia", "finland",
  "france", "germany", "hong_kong", "india", "indonesia",
  "iran", "iraq", "italy", "japan", "kenya",
  "luxembourg", "mexico", "morocco", "netherlands", "new_zealand",
  "nigeria", "norway", "palestine", "poland", "portugal",
  "qatar", "russia", "saudi_arabia", "south_africa", "south_korea",
  "spain", "sweden", "switzerland", "syria", "taiwan",
  "tunisia", "turkey", "uae", "uk", "ukraine",
  "united_states", "yemen",
];

const api = process.env.GITHUB_TOKEN;

async function getTopUsers(country) {
  const url = `https://committers.top/rank_only/${country}.json`;
  const response = await fetch(url);
  const data = await response.json();
  const topUsers = data.user.slice(0, 250);

  const filteredUsers = [];
  for (const username of topUsers) {
    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers: { "Authorization": `token ${api}`, "User-Agent": "TopRepos" }
      });
      const userData = await userResponse.json();
      const accountAgeYears = (new Date() - new Date(userData.created_at)) / (1000 * 3600 * 24 * 365);
      if (accountAgeYears >= 1 && userData.followers >= 15) {
        filteredUsers.push(username);
      }
    } catch {
      console.log(`[updater] ERROR fetching user ${username}`);
    }
  }
  return filteredUsers;
}

async function getTopRepos(users) {
  let BestProjects = [];
  for (const username of users) {
    try {
      const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { "Authorization": `token ${api}`, "User-Agent": "TopRepos" }
      });
      const repos = await repoResponse.json();
      repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3)
        .forEach(e => {
          BestProjects.push({
            repoFullName: e.full_name,
            totalPoints: (e.stargazers_count * 2) + (e.watchers_count / 2) + (e.forks_count / 2) - e.open_issues_count,
            avatar: e.owner.avatar_url
          });
        });
    } catch {
      console.log(`[updater] ERROR fetching repos for ${username}`);
    }
  }
  return BestProjects.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 50);
}

async function updateCountry(country) {
  try {
    const users = await getTopUsers(country);
    const bestProjects = await getTopRepos(users);
    for (let rank = 0; rank < bestProjects.length; rank++) {
      await uploadProcessData(bestProjects[rank], country, String(rank + 1));
    }
    console.log(`[updater] ${country} updated (${bestProjects.length} repos)`);
  } catch (err) {
    console.error(`[updater] Failed to update ${country}:`, err.message);
    setTimeout(updateCountry(country),breakFetch)
  }
}

// Runs through ALL countries sequentially, then schedules itself again after 48h
async function runUpdateCycle() {
  console.log(`\n[updater] Starting update cycle — ${new Date().toISOString()}`);
  for (const country of countries) {
    await updateCountry(country);
  }
  console.log(`[updater]  Cycle complete — ${new Date().toISOString()}`);
  console.log(`[updater]  Next cycle in 48 hours\n`);
  setTimeout(runUpdateCycle, HOURS_48);  // schedule next cycle AFTER this one finishes
}

// ─── App setup ────────────────────────────────────────────────────────────────
const app = express();

// ping
app.get('/ping', (req, res) => {
  res.json({ msg: 'pong' });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use router
app.use('/', indexRouter);
app.use('/country', topReposRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ─── Start update cycle once Firebase is ready ────────────────────────────────
configuration().then(() => {
  console.log('[updater]  Firebase ready — launching first update cycle');
  runUpdateCycle();
}).catch(err => {
  console.error('[updater]  Firebase init failed:', err.message);
});

module.exports = app;