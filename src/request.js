'use strict';

const http = require('http');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

let request = (options) => {
  return new Promise((resolve, reject) => {
    let start = Date.now();
    let ttfb, end;

    let cb = (res) => {
      res.on('data', (chunk) => {
        if (!ttfb) ttfb = Date.now() - start;
      });

      res.on('end', () => {
        resolve({
          ttfb,
          end: Date.now() - start,
          id: options.id
        });
      });
    };

    https.request(options, cb).end();
  });
};

module.exports = request;