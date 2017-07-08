/*jshint esversion: 6 */
const net = require('net');
const fs = require('fs');

var found = true;
var fileType;
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    var dataStr, file, header, body, response;
    console.log(data.toString());
    dataStr = data.toString().substr(0, data.indexOf('\n'));
    dataStr = dataStr.split(" ");
    file = dataStr[1];

    //transmit a hardcoded, in-memory html body for each route
    body = formatBody(file);

    //transmit standard http headers to the client
    header = formatHeader(body.length);

    //format response
    response = header + "\n" + body;

    //transmit response to the client
    socket.write(response);

    //terminate connection
    socket.destroy();
  });
}).listen(8080);

function formatHeader(contLength) {
  var status;
  if(found === true) {
    status = "HTTP/1.1 200 OK\n";
  } else {
    status = "HTTP/1.0 404 Not Found\n";
  }
  var server = "Server: hiki/1.2.8\n";
  var date = new Date().toUTCString();
  var contentType = "Content-Type: " + fileType + "; charset=utf-8\n";
  var contentLength = "Content-Length: " + contLength + "\n";
  var header = status + server + "Date: " + date + "\n" + contentType + contentLength;
  return header;
}

function formatBody(file) {
  if(file === "/" || file === "/index.html") {
    fileType = "text/html";
    found = true;
    return fs.readFileSync("./index.html", 'utf8');
  } else if(file === "/hydrogen.html") {
    fileType = "text/html";
    found = true;
    return fs.readFileSync("."+file, 'utf8');
  } else if(file === "/helium.html") {
    fileType = "text/html";
    found = true;
    return fs.readFileSync("."+file, 'utf8');
  } else if(file === "/404.html") {
    fileType = "text/html";
    found = true;
    return fs.readFileSync("."+file, 'utf8');
  } else if(file === "/css/styles.css") {
    fileType = "text/css";
    found = true;
    return fs.readFileSync("."+file, 'utf8');
  }
  fileType = "text/html";
  found = false;
  return fs.readFileSync("./404.html", 'utf8'); //incorrect file path
}