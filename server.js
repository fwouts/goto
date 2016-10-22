'use strict';

const http = require('http');
const mongoose = require('mongoose');

const PORT = 80;
const DB_NAME = 'goto';

const DB_LINK_SCHEMA = mongoose.Schema({
  key: String,
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
    return handleRedirectionRequest(request, response);
  } else {
    // TODO: Allow adding/changing/deleting links.
  }
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
