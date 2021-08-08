const express = require('express');
const dbHelper = require('./helpers/dbHelper')
const MongoClient = require('mongodb').MongoClient;
const urlParse = require('url-parse');
const http = require('http');

const connectUrl = "mongodb://localhost:27017/voltus";
const app = express();
const server = http.createServer(app);

app.get('/customer', (req, res) => {
    
    var q = urlParse(req.url, true).query;
    console.log("url=>", q);
    var custId = q.id;

    dbHelper.getCustomerById(custId, (val) => {
        console.log("=================", val);
        res.send(val);
    });
 
});

app.get('/program/customer', (req, res) => {

    var q = urlParse(req.url, true).query;
    
    var progId = q.pid;

    dbHelper.getProgramCustomers(progId, (val) => {
        console.log("programCustomers", val);
        res.send(val);
    });

});


app.post('/incident', (reg, res) => {

});

//http server
server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log("calling dbHelper");
  dbHelper.createPrograms();
  dbHelper.createCustomers();

});