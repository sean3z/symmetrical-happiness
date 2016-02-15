'use strict';

const async = require('async');
const request = require('./request');
const config = require('../config');

let tests = config.tests || [];

module.exports = (enabled, cb) => {
  async.parallel(users(), cb);

  function users() {
    let users = [];

    for (let x = config.request.users; x > 0; x--) {
      let user = (cb) => {
        async.series(tasks(), (err, results) => {
          cb(err, results);
        });
      };

      users.push(user);
    };

    return users;
  }

  function tasks() {
    let tasks = [];

    for (let id of Object.keys(tests)) {
      let test = tests[id];

      let options = {
        hostname: 'www.google.com',
        // hostname: config.environment.host,
        // path: test.path,
        method: test.method.toUpperCase(),
        headers: {Cookie: 'test=meow;'},
        id
      };

      if (enabled) {
        options.headers.Cookie = {};
      } else {
        options.headers.Cookie = {};
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
};
