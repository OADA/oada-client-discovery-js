# minimal.js

A minimal usage example of oada-client-discovery-js within an Express server.

## Starting the example

```sh
$ npm install
$ npm run minimal
```

## Using the example

There are at least two ways to observe the minimal example running:

1. Web Browser
2. [curl][curl]

### Web Browser
Navigate a web browser to

[http://localhost:3000/clientDiscovery?clientId=abc123%40agcloud.com](http://localhost:3000/clientDiscovery?clientId=abc123%40agcloud.com)

or

[http://localhost:3000/clientDiscovery?clientId=abc123%40agcloud.com](http://localhost:3000/clientDiscovery?clientId=abc123%40agcloud.com)
### curl

Run

```sh
$ curl -v -X GET http://localhost:3000/clientDiscovery?clientId=abc123%40agcloud.com
```

**Request:**
```http
GET /clientDiscovery?clientId=abc123%40agcloud.com HTTP/1.1
User-Agent: curl/7.35.0
Host: localhost:3000
Accept: */*
```

**Response:**
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 672
ETag: W/"2a0-8876ec5b"
Date: Wed, 15 Oct 2014 20:59:01 GMT
Connection: keep-alive

{
  "clientId": "abc123@agcloud.com",
  "redirectUrls": [
    "https://agcloud.com/redirect",
    "https://localhost:3000/redirect"
  ],
  "licenses": [
    "oada"
  ],
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "alg": "RS256",
      "kid": "ad8alkjca38afvudsZA",
      "n": "AOtWalmH3vZ2q2BeSRQjYzxqpyVR9HEJYJsTLkuD6pYrqwGPDxDChlALvH8PvRWTyBMMLA+jTjMOcovSCm0TEJfJ1pyDtPgtA1uPg5bn5CICPNieQuHwMwBSpjgB9B19eSgcoOqSZhhf6gMUX8FvggR08jBXhzZpAVNi1eNL4WmsD0Qkxz4L1YQu0euHflBGZ8OOyVe6tapm4UKJYWihE28cXlra8qqwfY4J1brv5Ot3yZMSOAfQ+4rf9J3ISChmVC3H/sshtUFwsd65I/7IpjawaRCsYwvrN/CMxXa5vcb4H2NzNOqidPqJzoHYa4WLDArpypZfb7krRUrrHRlT2xk",
      "e": "AQAB"
    }
  ]
}
```

[curl]: http://curl.haxx.se
