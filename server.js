const http = require('http');
const PORT = 80;

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});

function handleRequest(request, response) {
  response.end('It Works!! Path Hit: ' + request.url);
}
