var express = require('express');
var app = express();
var fs = require("fs");
var http = require("http");
var ncp = require('ncp').ncp;
ncp.limit = 16;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

var server = app.listen(8080, function () {

    var host = "localhost";
    var port = "8080";

    console.log("Escuchando en http://%s:%s", host, port);

});
app.engine('ejs', require('express-ejs-extend'));
app.set('views',__dirname+"/views/");
app.set('view engine','ejs');

app.use('/scripts', express.static(__dirname + '/public/javascripts'));
app.use('/img', express.static(__dirname + '/public/images'));
app.use('/css', express.static(__dirname + '/public/stylesheets'));

app.get('/', function(req, res) {
    console.log("Front-End: Request página inicial");
            res.render('index', {data:{title:"Landing Page"}});
});

app.get('/products', function(req,res){
    console.log("Front-End: Request página products");
            res.render('index',{data:"data"});

});

