const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    fs.readFile("project/login", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al cargar el archivo");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  })
  .listen(3000);

console.log("Servidor en http://localhost:3000");
