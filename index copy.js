// const app = require('express')();
// const http = require('http').createServer(app);
// const cors = require('cors'); 





// const urlParse = require('url-parse');
// const repository = require('./services/repository');
// const dispatcher = require('./services/dispatcher');
// const utils = require('./services/utils');

// app.use(cors());

// app.get('/', (req, res) => {
//     res.send('<h1>Hey Socket.io</h1>');
// });

// io.on('connection', (socket) => {
//     console.log('a user connected', socket.id);
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });

//     socket.on('handshake', (userId) => {
//         console.log('User : ' + userId + 'says hello');
//     });

//     socket.on('acknowledge', (ack) => {
//         console.log('Acknlowledgement Received', ack);
    
//         repository.updateDispatchAcknowledgement(ack, (val) => {           
//             console.log('Ack =', val);
//         });
//     });

    


// });

http.listen(3000, () => {
    console.log('listening on *:3000');
    repository.createPrograms();
    repository.createCustomers();
});

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


app.put('/incident', (req, res) => {
    console.log("---------------put--------------");
    //console.log(req);
    var incident = req.body;
    //console.log(incident);
    let correlationId = utils.createUUID();
    res.send('PUT');

    // repository.createNewIncident(correlationId, incident, (val) => {
    //     console.log("incident created", val);
    //     dispatcher.dispatchIncident(correlationId, val);
    //     res.send(val);
    // });
});

app.post('/test', (req, res) => {
    var incident = req.body;
    var q = urlParse(req.url, true).query;
    console.log(incident);
    res.send(q);

});

//Creates an incident for a program
app.post('/incident', (req, res) => {
    console.log('=============post----------');
    var incident = req.body;
    console.log(incident);
    
    let correlationId = utils.createUUID();
    res.send(req.body);

    // repository.createNewIncident(correlationId, incident, (val) => {
    //     console.log("incident created", val);
    //     dispatcher.dispatchIncident(correlationId, val);
    //     res.send(val);
    // });
});

//
app.delete('/purge', (req, res) => {
    var q = urlParse(req.url, true).query;
    let all = (q && q.all && q.all == 1);
    repository.purge(all);
    res.end();
});

