const express = require('express');
const repository = require('./services/repository');
const dispatcher = require('./services/dispatcher');
const urlParse = require('url-parse');
const http = require('http');

const connectUrl = "mongodb://localhost:27017/voltus";
const app = express();
const server = http.createServer(app);


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//get a specific customer
app.get('/customer', (req, res) => {

    var q = urlParse(req.url, true).query;
    console.log("url=>", q);
    var custId = q.id;

    repository.getCustomerById(custId, (val) => {
        console.log("=================", val);
        res.send(val);
    });

});

//gets all customers involved in a program
app.get('/program/customer', (req, res) => {

    var q = urlParse(req.url, true).query;

    

    if(!q || !q.pid){
        res.status(400).end();
    }

    repository.getProgramCustomers(q.pid, (val) => {
        //console.log("programCustomers", val);
        res.send(val);
    });

});

//gets all dispatch that involve a customer
app.get('/dispatch/customer', (req, res) => {

    var q = urlParse(req.url, true).query;
    if(!q || !q.cid){
        res.status(400).end();
    }

    repository.getDispatchesForCustomer(q.cid, (val) => {
        //console.log("programCustomers", val);
        res.send(val);
    });

});




//Creates an incident for a program
app.post('/incident', (req, res) => {
    var incident = req.body;
    
    let correlationId = createUUID();

    repository.createNewIncident(correlationId, incident, (val) => {
        console.log("incident created", val);
        dispatcher.dispatchIncident(correlationId, val);
        res.send(val);
    });
});

//
app.delete('/purge', (req, res) => {
    var q = urlParse(req.url, true).query;
    let all = (q && q.all && q.all == 1);
    repository.purge(all);
    res.end();
});




//http server
server.listen(3000, () => {
    console.log('listening on *:3000');
    console.log("calling repository");
    repository.createPrograms();
    repository.createCustomers();

});

//hellperfor GUID
function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }