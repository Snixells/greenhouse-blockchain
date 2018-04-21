const express = require('express');
const request = require('request');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

const Transaction = require('../../Transaction');
const Block = require('../../Block');

const options = {
    url: 'url',
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'GET'
}

// Get the whole chain 
router.get('/', (req, res, next) => {
    url = process.env.DB_HOST + process.env.DB_CHAIN + process.env.DB_VIEW_FULL_CHAIN;

    options.url = url;

    function callback(error, response, body) {
        // res.status(200).json(body);
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
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

    

    // Outer request -> getting the unconfirmed Transactions
    options.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + process.env.DB_VIEW_FULL_UNCONFIRMED;
    options.method = 'GET';

    // Request options

    const opts = {
        url: process.env.DB_HOST + process.env.DB_CHAIN, 
        headers: {
            'Authorization': process.env.DB_AUTHORIZATION,
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }


    function callback(error,response, body){
        let unconfirmedTransansactions = [];
        let newBlock = new Block('ahc');
        // res.setHeader('Content-Type', 'application/json');

        // const transaction = new Transaction({
        //     "lotsofdata": "data"
        // }, "", "")


        jsonResponse = JSON.parse(body);

        for (let i = 0; i < jsonResponse.total_rows; i++) {
            let transactionJson = jsonResponse.rows[i].value;
            newBlock.addTransaction(transactionJson.data, transactionJson.timestamp, transactionJson.hash);
        }
        console.log(newBlock);


        newBlock.calculateHash();

        opts.body = JSON.stringify(newBlock);
        request(opts, innerCallback);

        // res.send(body);
    }

    function innerCallback(error, response, body) {
        res.setHeader('Content-Type', 'application/json');
        res.send(response);
    }






    request(options, callback);


})

module.exports = router;