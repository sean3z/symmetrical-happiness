'use strict';

const users = require('./users');

console.log('Starting Tests...');
let tasks = {};

// get baseline for each test
console.log('Getting baseline...');
users(false, (err, results) => {
  done(err, results);

  // run tasks with toggles enabled
  console.log('Enabling toggles...');
  users(true, (err, results) => {
    done(err, results);
    compare();
  });
});

function done(err, results) {
  if (err) throw err;

  let totals = {};
  for(let user of results) {
    for(let task of user) {
      totals[task.id] = totals[task.id] || [];
      totals[task.id].push(task.ttfb);
    }
  }

  for(let task of Object.keys(totals)) {
    let sum = 0;
    for(let total of totals[task]) {
      sum += total;
    }

    tasks[task] = tasks[task] || [];
    tasks[task].push(sum / totals[task].length);
  }
}

function compare() {
  console.log('Generating Results...');
  for(let task of Object.keys(tasks)) {
    let results = tasks[task];
    console.log('  %s: %dms', task, results[0] - results[1]);
  }
}
