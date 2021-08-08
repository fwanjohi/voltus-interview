var MongoClient = require('mongodb').MongoClient;
//var connectUrl = "mongodb+srv://admin:fxiAdmin8522@fxicluster.uh3gu.mongodb.net/voltus?retryWrites=true&w=majority";
var connectUrl = "mongodb+srv://admin:fxiAdmin8522@fxicluster.uh3gu.mongodb.net/";
var dbName = "voltus";

exports.createCustomers = function () {
    console.log('creating customers')
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            return;
        }

        var dbo = db.db(dbName);
        dbo.collection("customers").findOne({}, function (err, result) {
            if (err) {
                console.error('ERROR: collection => ', err);
                return;
            }

            //if no results found, create my dummy customers
            if (!result) {

                const customers = [
                    { _id: 1, name: 'Keroche Wine', address: 'Highway 71', phone: '+16173086055', programId: 1, dispatchTypes: [1, 2, 3] },
                    { _id: 2, name: 'Tyson Food', address: 'Highway 71', phone: '+16173086055', programId: 1, dispatchTypes: [1, 2, 3] },
                    { _id: 3, name: 'Wallmart SF HQ', address: 'Highway 71', phone: '+16173086055', programId: 2, dispatchTypes: [1, 2, 3] },
                    { _id: 4, name: 'Amazon Wareshouse', address: 'Highway 71', phone: '+16173086055', programId: 2, dispatchTypes: [1, 2, 3] },
                    { _id: 5, name: 'Bacon Steal Meals', address: 'Highway 71', phone: '+16173086055', programId: 3, dispatchTypes: [1, 2, 3] },
                    { _id: 6, name: 'Simba Jungle Food Produceee', address: 'Highway 71', phone: '+16173086055', programId: 3, dispatchTypes: [1, 2, 3] },
                    { _id: 7, name: 'Walmart4', address: 'Highway 71', phone: '+16173086055', programId: 4, dispatchTypes: [1, 2, 3] },
                ];

                dbo.collection("customers").insertMany(customers, function (err, res) {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                    db.close();
                });

            } else {
                console.log('customers exist... NO NEED TO CREATE');
            }
        });

    });
}

exports.createPrograms = function () {
    console.log('creating programs')
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            return;
        }

        var dbo = db.db(dbName);
        dbo.collection("programs").findOne({}, function (err, result) {
            if (err) {
                console.error('ERROR: collection => ', err);
                return;
            }

            //if no results found, create my dummy customers
            if (!result) {

                const programs = [
                    { _id: 1, name: 'Green Mountain Energy Cool Mornings' },
                    { _id: 2, name: 'PG&E Easy Nights' },
                    { _id: 3, name: 'Festus Kilowatts Saver' },
                    { _id: 4, name: 'New Power New Grid' },
                ];

                dbo.collection("programs").insertMany(programs, function (err, res) {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                    db.close();
                });

            } else {
                console.log('programs exist... NO NEED TO CREATE');
            }

        });

    });
}

exports.getCustomerById = function (id, callBack) {
    custId = parseInt(id);
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            callBack([]);
        }

        var dbo = db.db(dbName);
        var query = { _id: custId };
        dbo.collection("customers").find(query).toArray(function (err, result) {
            console.log("calling get cutomer by id ", id);
            if (err) {
                console.error('Error getting customer: ', err);
                //return customer;
                callBack([]);
            } else {
                customers = result;
                console.log('getGustomer', result);
                callBack(result);
                //return customers;
            }
            db.close();
        });

    });

}


exports.getProgramCustomers = function (id, callBack) {
    let progId = parseInt(id);
    let program = undefined;
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            callBack([]);
        }

        const dbo = db.db(dbName);
        const  query = { _id: progId };
        dbo.collection("programs").findOne(query, function (err, result) {
           
            if (err) {
                console.error('Error getting customer: ', err);
                //return customer;
                callBack(program);
            } else {
                program = result;
                if (program){
                    const custQ ={ programId: progId };
                    dbo.collection("customers").find(custQ).toArray(function (custErr, custResult) {
                        program['programCustomers'] = custResult;
                        callBack(program);
                        db.close();
                    });

                } else {
                    console.log("program not found");
                    callBack(program);
                    db.close();
                }
                
                
                //return customers;
            }
           
        });



        // dbo.collection('programs').aggregate([
        //     { $lookup:
        //       {
        //         from: 'customers',
        //         localField: 'programId',
        //         foreignField: '_id',
        //         as: 'programCustomers'
        //       }
        //     }
        //   ]).toArray(function(err, res) {
        //     if (err) throw err;
        //     console.log(JSON.stringify(res));
        //     callBack(res);
        //     db.close();
          //});

    });
}

exports.createNewIncident = function (incident) {
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            return;
        }

        dbo.collection("incidents").insertOne(incident, function (err, res) {
            if (err) {
                console.error('ERROR connecting:', err);
                return;
            }

            console.log("1 document inserted", res);
            db.close();
        });
    });

}




