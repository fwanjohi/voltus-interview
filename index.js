const express = require('express');
const urlParse = require('url-parse');
const http = require('http');
const repository = require('./services/repository');
const dispatcher = require('./services/dispatcher');
const utils = require('./services/utils');
const logger = require('./services/logger');

//const io = require('socket.io')(http);

const connectUrl = "mongodb://localhost:27017/voltus";
const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

const cors = require('cors');
const { Logger } = require('mongodb');
app.use(cors());

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



    if (!q || !q.pid) {
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
    if (!q || !q.cid) {
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

    let correlationId = utils.createUUID();

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


//WebSocket Hookup for direct connection
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('handshake', (userId) => {
        console.log('User : ' + userId + 'says hello');
    });

    socket.on('acknowledge', (ack) => {
        console.log('Acknlowledgement Received', ack);
        let corId = utils.createUUID();
        repository.updateDispatchAcknowledgement(corId, ack, (success) => {

            let log = {
                datalogType: "dispatch-ack",
                id: ack._id,
                data: ack,
                success: success
            }
            
            ack["success"] = success;
            logger.logAudit(corId, log);
            socket.emit('acknowledge-update', [ack]);
        });
    });
})
