var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
var server = app.listen(8081, function () {

    var host = "localhost";
    var port = "8081";

    console.log("Escuchando en http://%s:%s", host, port);

});

app.get('/sites', function (req, res) {
    console.log("API: Request GET en /sites");
    fs.readFile( __dirname + "/" + "sites.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        res.json(JSON.parse(data));
    });
});

app.get('/sites/:siteid', function (req, res) {
    console.log("API: Request GET en /sites/"+req.params.siteid);
    fs.readFile( __dirname + "/" + "sites.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        const id = req.params.siteid;
        const sites = JSON.parse(data);
        const site = sites.filter(s => s.id==id)[0];
        if (site == null){
            res.status(404).end();
            return;
        }
        res.json(site);
    });
});

app.get('/sites/:siteid/categories', function (req, res) {
    console.log("API: Request GET en /sites/"+req.params.siteid+"/categories");
    const siteid = req.params.siteid;
    fs.readFile( __dirname + "/categories/" + siteid +"/categories.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        var categories = JSON.parse(data);
        let cats = [];
        categories.forEach( c =>
            cats.push({
                id: c.id,
                name: c.name,
                picture: c.picture
            })
        );
        res.json(cats);
    });
});


app.get('/sites/:siteid/categories/:categoryid', function (req, res) {
    console.log("API: Request GET en /sites/"+req.params.siteid+"/categories/"+req.params.categoryid);
    const siteid = req.params.siteid;
    fs.readFile( __dirname + "/categories/" + siteid +"/categories.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        var categories = JSON.parse(data);
        const catid = req.params.categoryid;
        const category = categories.filter(s => s.id == catid)[0];

        if (category == null){
            res.status(404).end();
            return;
        }

        const out = {
            id: category.id,
            name: category.name,
            picture: category.picture
        };
        res.json(out);
    });
});

app.post('/sites/:siteid/categories', function (req, res) {
    console.log("API: Request POST en /sites/"+req.params.siteid+"/categories");
    const siteid = req.params.siteid;
    fs.readFile( __dirname + "/categories/" + siteid +"/categories.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        const newName = req.body.name;
        const newPicture = req.body.picture;

        if (!newName || !newPicture ){
            res.status(400).end();
            return;
        }

        var categories = JSON.parse(data);
        let newId;
        do {
            newId = siteid + (Math.floor(Math.random() * 1000) + 1000).toString();
        }
        while (categories.filter(s => s.id == newId).length != 0);

        let cats = [];
        categories.forEach( c =>
            cats.push({
                id: c.id,
                name: c.name,
                picture: c.picture
            })
        );
        cats.push({
        id: newId,
        name: newName,
        picture: newPicture
        });

        fs.writeFile(__dirname + "/categories/" + siteid +"/categories.json", JSON.stringify(cats) ,'utf8', function (err, data){

            if (err){
                res.status(400).end();
                return;
            }

            res.json(cats);

        });

    });
});

app.delete('/sites/:siteid/categories/:categoryid', function (req, res) {
    console.log("API: Request DELETE en /sites/"+req.params.siteid+"/categories/"+req.params.categoryid);
    const siteid = req.params.siteid;
    fs.readFile( __dirname + "/categories/" + siteid +"/categories.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        var categories = JSON.parse(data);
        const catid = req.params.categoryid;
        let cats = [];
        categories.forEach(c => {
            if (c.id != catid){
                cats.push({
                    id: c.id,
                    name: c.name,
                    picture: c.picture
                });
            }
        });
        fs.writeFile(__dirname + "/categories/" + siteid +"/categories.json", JSON.stringify(cats) ,'utf8', function (err, data){

            if (err){
                res.status(400).end();
                return;
            }
            res.status(200).end();

        });
    });
});

app.put('/sites/:siteid/categories/:categoryid', function (req, res) {
    console.log("API: Request PUT en /sites/"+req.params.siteid+"/categories/"+req.params.categoryid);
    const siteid = req.params.siteid;
    fs.readFile( __dirname + "/categories/" + siteid +"/categories.json", 'utf8', function (err, data) {

        if (err){
            res.status(400).end();
            return;
        }

        var categories = JSON.parse(data);
        const catid = req.params.categoryid;
        categories.forEach(c => {
            if (c.id == catid){
                if (req.body.name)
                    c.name = req.body.name;
                if (req.body.picture)
                    c.picture = req.body.picture;
            }
        } );
        fs.writeFile(__dirname + "/categories/" + siteid +"/categories.json", JSON.stringify(categories) ,'utf8', function (err, data){

            if (err){
                res.status(400).end();
                return;
            }

            res.status(200).end();

        });
    });
});
