/*jshint esversion: 6 */
const net = require('net');

var uri, showHeader = false;
const client = new net.Socket();
client.setEncoding('utf8');

//CHECK IF USER WANTS TO ONLY DISPLAY HEADERS
if(process.argv[3] === "-H") {
  showHeader = true;
}

//CONNECT TO LOCAL HOST
if(process.argv[2] === "localhost") {
  uri = process.argv[2];
  client.connect(8080, uri, () => {
    client.write(formatHeader(uri));
  });
//CONNECT TO OTHER
} else if(process.argv[2] !== undefined) {
  uri = process.argv[2];
  client.connect(80, uri, () => {
    client.write(formatHeader(uri));
  });
//NO URI SPECIFIED
} else {
  //HELP MESSAGE
  process.stdout.write("--- HELP/USAGE ---\n");
  process.stdout.write("In order to properly run this HTTP socket client,\nyou must specify the host and uri to request a resource from.\n");
  process.stdout.write("* example: node client.js www.devleague.com\n\n");
  process.stdout.write("--- OPTIONS ---\n");
  process.stdout.write("If you would only like to display headers in the output, run in this format:\n");
  process.stdout.write("* example: node client.js localhost -H\n");
}

client.on('data', (data) => {
  var header, body;
  header = data.toString().substr(0, data.indexOf('<'));
  body = data.toString().substr(data.indexOf('<'), data.length);
  if(showHeader === true) {
    process.stdout.write(header);
  } else {
    process.stdout.write(body);
  }
});

//REQUEST HEADER
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