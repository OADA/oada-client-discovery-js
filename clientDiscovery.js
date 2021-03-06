/* Copyright 2014 Open Ag Data Alliance
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
'use strict';

var objectAssign = require('object-assign');
var cors = require('cors');
var debug = require('debug')('oada-client-discovery');
var OADAError = require('oada-error').OADAError;

function clientDiscovery(lookup, options) {
  if (typeof lookup !== 'function' || lookup.length != 2) {
    throw new Error('clientDiscovery() requires lookup(clientId, done)');
  }

  options = options || {};
  options.cors = options.cors || {};

  var corsMiddleware = cors(options.cors);

  var base = {
    clientId: '',
    redirectUrls: [],
    licenses: [],
    keys: []
  };

  return function middleware(req, res, next) {
    // Enable cors for client discovery
    corsMiddleware(req, res, function(err) {
      if (err) { return next(err); }

      var clientId = req.query.clientId;

      if (!clientId) {
        return next(new OADAError('Query parameter clientId is required',
                        OADAError.codes.BAD_REQUEST,
                        'Program error, please contact the developer'));
      }

      lookup(clientId, function(err, clientReg) {
        if (err) {
          return next(
            new OADAError('Client ID lookup error: ' + err,
                          OADAError.codes.NOT_FOUND,
                          'Program error, please contact the developer'));
        }

        if (!clientReg) {
          return next(
            new OADAError('Cannot find ' + clientId + ' registration',
                          OADAError.codes.NOT_FOUND,
                          'Program error, please contact the developer'));
        }

        var reg = objectAssign({}, base, clientReg);
        reg.clientId = clientId;

        debug('Found registration document for ' + clientId);
        res.json(reg);
      });
    });
  };
}

module.exports = clientDiscovery;
