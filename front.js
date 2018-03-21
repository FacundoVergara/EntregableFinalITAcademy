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

app.set('views',__dirname+"/views/");
app.set('view engine','ejs');

app.use('/scripts', express.static(__dirname + '/public/javascripts'));
app.use('/img', express.static(__dirname + '/public/images'));
app.use('/css', express.static(__dirname + '/public/stylesheets'));

app.get('/', function(req, res) {
    console.log("Front-End: Request página inicial");
    const url =
        "http://localhost:8081/sites";
    http.get(url, resh => {
        resh.setEncoding("utf8");
        let body = "";
        resh.on("data", data => {
            body += data;
        });
        resh.on("end", () => {
            body = JSON.parse(body);
            res.render('index', {data:body});
        });
    });
});

app.post('/reloadBackup', function(req, res) {
    console.log("Front-End: Request de recargar del backup");
    const source = __dirname+"/BACKUP/";
    const destination = __dirname;
    ncp(source, destination, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Restaurado de Backup');
    });
            res.status(200).end();

});


app.post('/sites', function(req, res) {
    console.log("Front-End: Request lista de categorias de sitio: "+req.body.siteId);
    const siteId = req.body.siteId;
    const url =
        "http://localhost:8081/sites/"+siteId+"/categories";
    http.get(url, resh => {
        resh.setEncoding("utf8");
        let body = "";
        resh.on("data", data => {
            body += data;
        });
        resh.on("end", () => {
            body = JSON.parse(body);

            res.render('listaCat', {data:{cats:body,siteId:siteId}});
        });
    });
});

app.post('/showCategory', function(req, res) {
    console.log("Front-End: Request información de categoría: "+req.body.catId);
    const catId = req.body.catId;
    const siteId = catId.slice(0,3);
    const url =
        "http://localhost:8081/sites/"+siteId+"/categories/"+catId;
    http.get(url, resh => {
        resh.setEncoding("utf8");
        let body = "";
        resh.on("data", data => {
            body += data;
        });
        resh.on("end", () => {
            body = JSON.parse(body);

            res.render('catShow', {data:body});
        });
    });
});

app.post('/newCategory', function(req, res) {
    console.log("Front-End: Request formulario de nueva categoría para sitio: "+req.body.siteId);
    const siteId = req.body.siteId;
     res.render('catCreate', {data:siteId});


});


app.post('/deleteCategory', function(req, res) {
    console.log("Front-End: Request de eliminar categoría: "+req.body.catId);
    const catId = req.body.catId;
    const siteId = catId.slice(0,3);
    var options = {
        hostname: 'localhost',
        port: 8081,
        path: "/sites/"+siteId+"/categories/"+catId,
        method: "DELETE"
    };
    var reqh = http.request(options, function (resh) {
        var responseString = "";
        resh.on("data", function (data) {
            responseString += data;
            // save all the data from response
        });
        resh.on("end", function () {

            res.status(200).end();
        });
    });
    reqh.end();


});

app.post('/editCategory', function(req, res) {
    console.log("Front-End: Request de editar categoría: "+req.body.catId);
    const catId = req.body.catId;
    const catName = req.body.catName;
    const catPicture = req.body.catPicture;
    let catData = {
        "name": catName,
        "picture": catPicture
    };
    const siteId = catId.slice(0,3);
    var options = {
        hostname: 'localhost',
        port: 8081,
        path: "/sites/"+siteId+"/categories/"+catId,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var reqh = http.request(options, function (resh) {
        var responseString = "";
        resh.on("data", function (data) {
            responseString += data;
            // save all the data from response
        });
        resh.on("end", function () {

            res.status(200).end();
        });
    });
    reqh.write(JSON.stringify(catData));
    reqh.end();


});

app.post('/createCategory', function(req, res) {
    console.log("Front-End: Request de crear categoría en sitio: "+req.body.siteId);
    const siteId = req.body.siteId;
    const catName = req.body.catName;
    const catPicture = req.body.catPicture;
    let catData = {
        "name": catName,
        "picture": catPicture
    };
    var options = {
        hostname: 'localhost',
        port: 8081,
        path: "/sites/"+siteId+"/categories",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var reqh = http.request(options, function (resh) {
        var responseString = "";
        resh.on("data", function (data) {
            responseString += data;
            // save all the data from response
        });
        resh.on("end", function () {

            res.status(200).end();
        });
    });
    reqh.write(JSON.stringify(catData));
    reqh.end();


});