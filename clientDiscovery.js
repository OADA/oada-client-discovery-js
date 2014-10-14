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
        return res.status(400).send('Query parameter clientId is required');
      }

      lookup(clientId, function(clientReg) {
        if (!clientReg) {
          return res.status(404).send('Client Registration ' + clientId +
                                      ' not found');
        }

        var reg = objectAssign({}, base, clientReg);
        reg.clientId = clientId;

        res.json(reg);
      });
    });
  };
}

module.exports = clientDiscovery;
