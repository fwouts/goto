'use strict';

const http = require('http');
const mongoose = require('mongoose');
const url = require('url');

const PORT = 80;
const DB_NAME = 'goto';

const REGISTER_PATH = '/register/';

const DB_LINK_SCHEMA = mongoose.Schema({
  key: { type: String, unique: true },
  url: String
});
const Link = mongoose.model('Link', DB_LINK_SCHEMA);

mongoose.connect('mongodb://localhost/' + DB_NAME);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', function() {
  console.log('Connected to database.');
});

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});

function handleRequest(request, response) {
  if (request.method == 'GET') {
    if (request.url.startsWith(REGISTER_PATH)) {
      return handleRegisterRequest(request, response);
    } else {
      return handleRedirectionRequest(request, response);
    }
  } else {
    // TODO: Allow adding/changing/deleting links.
  }
}

function handleRegisterRequest(request, response) {
  let parsedUrl = url.parse(request.url, true);
  let key = parsedUrl.pathname.substr(REGISTER_PATH.length);
  let link = new Link({
    key: key,
    url: parsedUrl.query.url
  });
  link.save((err, link) => {
    if (err) {
      response.end('Could not save');
      console.log(err);
      return;
    }
    response.writeHead(302, {
      'Location': link.url
    });
    response.end();
  });
}

function handleRedirectionRequest(request, response) {
  let key = request.url.substr(1);
  Link.findOne({
    key: key
  }, (err, link) => {
    if (err || !link) {
      response.end('No such link');
      return;
    }
    response.writeHead(302, {
      'Location': link.url
    });
    response.end();
  });
}
