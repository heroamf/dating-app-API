var http = require("http"),
  express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser");

//check de ambiente
var isProduction = process.env.NODE_ENV === "production";

//declaração do app global
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 3000, () =>
  console.log("Porta " + server.address().port)
);

// http
//   .createServer(function (req, res) {
//     res.write("Hello World!"); //write a response to the client
//     res.end(); //end the response
//   })
//   .listen(8080); //the server object listens on port 8080
