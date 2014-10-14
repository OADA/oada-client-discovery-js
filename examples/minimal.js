/*
 * Copyright 2014 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http: *www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by servicelicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var express = require('express');
var clientDiscovery = require('../clientDiscovery');

var service = express();
service.set('json spaces', 2);

/* Mock clients database */
var clients = {
  'abc123@agcloud.com': {
    redirectUrls: [
      'https://agcloud.com/redirect',
      'https://localhost:3000/redirect',
    ],
    licenses: [
      'oada',
    ],
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        alg: 'RS256',
        kid: 'ad8alkjca38afvudsZA',
        n: 'AOtWalmH3vZ2q2BeSRQjYzxqpyVR9HEJYJsTLkuD6pYrqwGPDxDChlALvH8PvRW' +
           'TyBMMLA+jTjMOcovSCm0TEJfJ1pyDtPgtA1uPg5bn5CICPNieQuHwMwBSpjgB9B' +
           '19eSgcoOqSZhhf6gMUX8FvggR08jBXhzZpAVNi1eNL4WmsD0Qkxz4L1YQu0euHf' +
           'lBGZ8OOyVe6tapm4UKJYWihE28cXlra8qqwfY4J1brv5Ot3yZMSOAfQ+4rf9J3I' +
           'SChmVC3H/sshtUFwsd65I/7IpjawaRCsYwvrN/CMxXa5vcb4H2NzNOqidPqJzoH' +
           'Ya4WLDArpypZfb7krRUrrHRlT2xk',
        e: 'AQAB',
      }
    ]
  },
  'def456@agcloud.com': {
    redirectUrls: [
      'https://agcloud.com/redirect',
      'https://localhost:3000/redirect',
    ],
  },
};

function lookupClient(clientId, cb) {
  if (clients[clientId] !== undefined) {
    cb(clients[clientId]);
  } else {
    cb(null);
  }
}

service.get('/clientDiscovery', clientDiscovery(lookupClient));

var server = service.listen(3000, function() {
  console.log('OADA Client Discovery Service running at ' +
              server.address().address + ':' + server.address().port +
              '/clientDiscovery');
});
