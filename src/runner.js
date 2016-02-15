'use strict';

const async = require('async');
const config = require('../config');
const request = require('./request');

let tests = config.tests || [];

// get baseline for each test
async.parallel(users(), done);

function users() {
  let users = [];

  for (let x = config.request.users; x > 0; x--) {
    let user = (cb) => {
      async.series(tasks(true), (err, results) => {
        cb(err, results);
      });
    };

    users.push(user);
  };

  return users;
}

function done(err, results) {
  console.log(results);
}

// get results with cookies enabled
// async.parallel(tasks, callback);
// function callback(err, results) {};
// async.series(tasks(true), callback);

function tasks(test) {
  let tasks = [];
  for (let test of tests) {
    let options = {
      hostname: 'www.google.com',
      // hostname: config.environment.host,
      // path: test.path,
      method: test.method.toUpperCase()
    };

    if (test) {
      options.headers = {};
    } else {
      options.headers = {};
    }

    for (let x = config.request.requests; x > 0; x--) {
      let task = (cb) => {
        setTimeout(() => {
          request(options).then((req) => {
            cb(null, req);
          });
        }, config.request.delay * 1000);
      };

      tasks.push(task);
    };
  }

  return tasks;
}

function callback(err, results) {
  console.log(results);
}