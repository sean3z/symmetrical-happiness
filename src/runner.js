'use strict';

const users = require('./users');

// get baseline for each test
users(false, (err, results) => {
  console.log(results);
});
