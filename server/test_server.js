const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello');
});
server.listen(5001, () => {
  console.log('Test server running on 5001');
});
