const express = require('express');
const request = require('request');
const router = express.Router();
const NodeCouchDb = require('node-couchdb');
const bodyParser = require('body-parser');
const path = require('path');

const Transaction = require('../../Transaction');
const Block = require('../../Block');

// Get the whole chain 
router.get('/', (req, res, next) => {
    url = process.env.DB_HOST + process.env.DB_CHAIN + process.env.DB_VIEW_FULL_CHAIN;

    const options = {
        url: url,
        // headers: {
        //     'Authorization' : process.env.DB_AUTHORIZATION
        // }
    };

    function callback(error, response, body) {
        // res.status(200).json(body);
        console.log(url);
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
        console.log(body);
    }

    request(options, callback);

});

router.get('/test', (req, res, next) => {
    couch.get()
})


// Create new Block consisting of ../unconfirmed Transaction
router.post('/newBlock', (req, res, next) => {
    // couch.get(dbUnconfirmedName, viewFullUnconfirmed).then(({ data, headers, status }) => {

    //     let unconfirmedTransactionsJs = [];
    //     let unconfirmedTransactionDBIDs = [];
    //     let unconfirmedTransactionDBRevs = [];
    //     let newBlock = new Block("abc");

    //     for (let i = 0; i < data.total_rows; i++) {

    //         unconfirmedTransactionsJs.push(data.rows[i].value);
    //         // unconfirmedTransactionDBIDs.push(data.)
    //     }
    //     unconfirmedTransactionsJs.forEach(transaction => {
    //         newBlock.addTransaction(transaction.data, transaction.timestamp, transaction.hash);
    //     });
    //     newBlock.calculateHash();

        // couch.insert(dbChainName, newBlock)
        //     .then(({ data, headers, status }) => {
        //         console.log("Data " + data);
        //         console.log("Status: " + status);
        //     }, err => {
        //         console.log("error " + err)
        //     })

        // res.status(200).json({
        //     message: "Successfull!"
        // })
    // })
})

module.exports = router;