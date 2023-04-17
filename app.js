const http = require('http');
const url = require('url');

const port = process.env.PORT

const server = http.createServer((req, res) => {
  console.log(JSON.stringify(req.headers));

  timeout = 0
  statusCode = 200
  const path = url.parse(req.url, true).pathname
  const queryObject = url.parse(req.url, true).query;
  if (path == '/wait') {
    timeout = queryObject.time;
  }

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || null;

  linkvars = ""

  for (const variable in process.env) {
    if (variable.endsWith("_URL")) {
      linkvars += variable + " : " + process.env[variable] + '\n'
    }
  }

  responseText = 'Hello World!\nI\'m: ' + process.env.APP + '\\' + process.env.SERVICE + '\nBuild:' + process.env.BUILD + '\nRelease: ' + process.env.RELEASE + '\nrunning on: ' + process.env.RACK + '\n and Instance: ' + process.env.INSTANCE_IP + '\n and timeout: ' + timeout + '\n and path: ' + path + '\n and query: ' + JSON.stringify(queryObject) + `\n\n\n\nIP: \n` + ip + `\n\n\n\nLink variables: \n` + linkvars + `\n\n\n\nHeaders: \n` + JSON.stringify(req.headers);

  if (path == '/failure') {
    statusCode = 500;
    responseText = '';
  }

  setTimeout(function () {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'text/plain');
    res.end(responseText);
    console.log('PING');
  }, timeout)

});

server.listen(port, () => {
  linkvars = ""

  for (const variable in process.env) {
    if (variable.endsWith("_URL")) {
      linkvars += variable + " : " + process.env[variable] + '\n'
    }
  }

  console.log(`Server running at ${port}/` + process.env.APP + '\\' + process.env.SERVICE + '\nBuild:' + process.env.BUILD + '\nRelease: ' + process.env.RELEASE + '\nrunning on: ' + process.env.RACK + '\n and Instance: ' + process.env.INSTANCE_IP + `\n\nLink variables: ` + linkvars);
});
