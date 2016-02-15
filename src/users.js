'use strict';

const async = require('async');
const request = require('./request');
const config = require('../config');

let tests = config.tests || [];

module.exports = (enabled, cb) => {
  async.parallel(users(enabled), cb);
};

function users(enabled) {
  let users = [];

  for (let x = config.request.users; x > 0; x--) {
    let user = (cb) => {
      async.series(tasks(enabled), (err, results) => {
        cb(err, results);
      });
    };

    users.push(user);
  };

  return users;
}

function tasks(enabled) {
  let tasks = [];
  for (let test of tests) {
    let options = {
      hostname: 'www.google.com',
      // hostname: config.environment.host,
      // path: test.path,
      method: test.method.toUpperCase()
    };

    if (enabled) {
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
