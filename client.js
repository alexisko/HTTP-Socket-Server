/*jshint esversion: 6 */
const net = require('net');

var uri;
const client = new net.Socket();
client.setEncoding('utf8');

if(process.argv[2] !== undefined && process.argv[3] === "-H") {
  var header;
  uri = process.argv[2];
  if(uri === 'localhost') {
    client.connect(8080, uri, () => {
      client.write(formatHeader(uri));
      client.on('data', (data) => {
        header = data.toString().substr(0, data.indexOf('<'));
        process.stdout.write(header);
      });
    });
  } else {
    client.connect(80, uri, () => {
      client.write(formatHeader(uri));
      client.on('data', (data) => {
        header = data.toString().substr(0, data.indexOf('<'));
        process.stdout.write(header);
      });
    });
  }
} else if(process.argv[2] !== undefined) {
  var body;
  uri = process.argv[2];
  if(uri === 'localhost') {
    client.connect(8080, uri, () => {
      client.write(formatHeader(uri));
      client.on('data', (data) => {
        body = data.toString().substr(data.indexOf('<'), data.length);
        process.stdout.write(body);
      });
    });
  } else {
    client.connect(80, uri, () => {
      client.write(formatHeader(uri));
      client.on('data', (data) => {
        body = data.toString().substr(data.indexOf('<'), data.length);
        process.stdout.write(body);
      });
    });
  }
} else {
  //HELP MESSAGE
  process.stdout.write("--- HELP/USAGE ---\n");
  process.stdout.write("In order to properly run this HTTP socket client,\nyou must specify the host and uri to request a resource from.\n");
  process.stdout.write("* example: node client.js www.devleague.com\n\n");
  process.stdout.write("--- OPTIONS ---\n");
  process.stdout.write("If you would only like to display headers in the output, run in this format:\n");
  process.stdout.write("* example: node client.js localhost -H\n");
}

function formatHeader(URI) {
  var method, host, accept, date, userAgent;
  method = "GET / HTTP/1.1\r\n";
  host = "Host: " + URI + "\r\n";
  accept = "Accept: text/html, text/css, application/json\r\n";
  date = new Date().toUTCString();
  userAgent = "User-Agent: hiki\r\n\r\n";
  header = method + host + accept + "Date: " + date + "\r\n" + userAgent;
  return header;
}