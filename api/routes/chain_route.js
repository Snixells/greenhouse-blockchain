const express = require('express');
const request = require('request');
const router = express.Router();

const Block = require('../../Block');

// HTTP Request options 
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
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    }

    request(options, callback);

});


// Create new Block consisting of ../unconfirmed Transaction
router.post('/newBlock', (req, res, next) => {

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


    function getUnconfirmedTransactionsCallback(error,response, body){
        let unconfirmedTransansactions = [];
        let newBlock = new Block('ahc');

        jsonResponse = JSON.parse(body);

        // Adding all transactions to newBlock
        for (let i = 0; i < jsonResponse.total_rows; i++) {
            let transactionJson = jsonResponse.rows[i].value;
            newBlock.addTransaction(transactionJson.data, transactionJson.timestamp, transactionJson.hash);
        }

        // Calculating newBLock hash
        newBlock.calculateHash();

        // Adding block to http body (to post it to chain)
        opts.body = JSON.stringify(newBlock);

        // Calling http request function to publish block
        request(opts, postBlockToChainCallback);
    }

    // POSTing Block to new doc on chain
    function postBlockToChainCallback(error, response, body) {
    }

    request(options, getUnconfirmedTransactionsCallback); 

    // Now deleting all the unconfirmed transactions which are beeing published to the chain (as a block)

    options.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + "_all_docs";
    options.method = 'GET';

    // Outer Function gets the rev's and id's from the transactions
    function getAllDocsCallback(error, response, body) {

        allDocsJson = JSON.parse(body);

        opts.method = 'DELETE';

        for (let i = 0; i < allDocsJson.total_rows; i++) {
            if (allDocsJson.rows[i].key === process.env.DB_VIEW_KEY_FULL_UNCONFIRMED) {
                continue
            } else {    
                opts.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + allDocsJson.rows[i].id + '?rev=' + allDocsJson.rows[i].value.rev;
                console.log(opts.url);
                request(opts, deleteAllDocs);
            }
        }

        res.send({
            "message": "Published Blocks to chain and deleted unconfirmed Transactions!"
        })
    }

    function deleteAllDocs(error, response, body) {
        console.log(body);
    }

    request(options, getAllDocsCallback)


})

module.exports = router;