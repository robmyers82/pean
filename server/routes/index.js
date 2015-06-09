var express = require('express');
var router = express.Router();
var path = require('path');
var postgres = require('../../lib/postgres');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'web', 'views', 'index.html'));
});

router.post('/api/v1/todos', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // SQL Query > Insert Data
    postgres.client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

    // SQL Query > Select Data
    var query = postgres.client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        return res.json(results);
    });
});

router.get('/api/v1/todos', function(req, res) {

    var results = [];

    // SQL Query > Select Data
    var query = postgres.client.query("SELECT * FROM items ORDER BY id ASC;");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        return res.json(results);
    });

});

router.put('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // Grab data from http request
    var data = {text: req.body.text, complete: req.body.complete};

    // SQL Query > Update Data
    postgres.client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

    // SQL Query > Select Data
    var query = postgres.client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        return res.json(results);
    });

});

router.delete('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // SQL Query > Delete Data
    postgres.client.query("DELETE FROM items WHERE id=($1)", [id]);

    // SQL Query > Select Data
    var query = postgres.client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        return res.json(results);
    });

});

module.exports = router;
