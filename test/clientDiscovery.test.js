/*
 * Copyright 2014 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global describe, it */
/*jshint expr:true */
'use strict';

var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');

var oadaErrorMiddleware = require('oada-error').middleware;

var clientDiscovery = require('../clientDiscovery');

function lookup(clientId, cb) {
  switch (clientId) {
    case '123@agcloud.com':
      cb({});
      break;

    default:
      cb(null);
      break;
  }
}

describe('clientDiscovery', function() {

  it('should be exported', function() {
    expect(clientDiscovery).to.be.a('function');
  });

  it('should pass errors up', function(done) {
    var options = {};
    options.cors = function failingOptionsCallback(req, cb) {
      cb(new Error('Options Failure'));
    };

    var app = express();
    app.get('/clientDiscovery', clientDiscovery(lookup, options));

    app.use(function(err, req, res, next) {
      expect(err).to.be.ok;
      expect(err.message).to.equal('Options Failure');

      next();
    });
    app.use(oadaErrorMiddleware());

    request(app)
      .get('/clientDiscovery')
      .query({clientId: '123@agcloud.com'})
      .expect(404, done);
  });

  it('should fail if no lookup function provided', function() {
    expect(clientDiscovery.bind(clientDiscovery)).to.throw();
  });

  it('should require clientId query parameter', function(done) {
    var app = express();
    app.get('/clientDiscovery', clientDiscovery(lookup));
    app.use(oadaErrorMiddleware());

    request(app)
      .get('/clientDiscovery')
      .expect(400, done);
  });

  it('should succeed with valid client id', function(done) {
    var app = express();
    app.get('/clientDiscovery', clientDiscovery(lookup));
    app.use(oadaErrorMiddleware());

    request(app)
      .get('/clientDiscovery')
      .query({clientId: '123@agcloud.com'})
      .expect(200, done);
  });

  it('should fail with invalid client id', function(done) {
    var app = express();
    app.get('/clientDiscovery', clientDiscovery(lookup));
    app.use(oadaErrorMiddleware());

    request(app)
      .get('/clientDiscovery')
      .query({clientId: '456@agcloud.com'})
      .expect(404, done);
  });
});
