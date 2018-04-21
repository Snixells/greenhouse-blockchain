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


    function getUnconfirmedTransactionsCallback(error, response, body) {
        let unconfirmedTransansactions = [];
        let newBlock = new Block('ahc');

        jsonResponse = JSON.parse(body);

        if (jsonResponse.total_rows >= 0) {
            // Adding all transactions to newBlock
            for (let i = 0; i < jsonResponse.total_rows; i++) {
                let transactionJson = jsonResponse.rows[i].value;
                newBlock.addTransaction(transactionJson.data, transactionJson.timestamp, transactionJson.hash);
            }

            if (newBlock.transactions.length > 1) {
                // Calculating newBLock hash
                newBlock.calculateHash();

                // Adding block to http body (to post it to chain)
                opts.body = JSON.stringify(newBlock);

                // Calling http request function to publish block
                request(opts, postBlockToChainCallback);
            }
        } else {
            res.send({
                "message": "No unconfirmed Transactions"
            })
        }
    }

    // POSTing Block to new doc on chain
    function postBlockToChainCallback(error, response, body) {
        console.log("Block to DB: " + body);
    }

    request(options, getUnconfirmedTransactionsCallback);

    // Now deleting all the unconfirmed transactions which are beeing published to the chain (as a block)

    options.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + "_all_docs";
    options.method = 'GET';

    // Outer Function gets the rev's and id's from the transactions
    function getAllDocsCallback(error, response, body) {

        const optionsDeleteUnconfirmed = {
            url: 'url',
            headers: {
                'Authorization': process.env.DB_AUTHORIZATION,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        }
        console.log(error)

        allDocsJson = JSON.parse(body);

        let transactions = 0;

            for (let i = 0; i < allDocsJson.total_rows; i++) {
                if (allDocsJson.rows[i].key === process.env.DB_VIEW_KEY_FULL_UNCONFIRMED) {
                    continue
                } else {
                    transactions++;
                    optionsDeleteUnconfirmed.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + allDocsJson.rows[i].id + '?rev=' + allDocsJson.rows[i].value.rev;
                    console.log("109 " + optionsDeleteUnconfirmed.url);
                    console.log("114 " + optionsDeleteUnconfirmed.method + " " + optionsDeleteUnconfirmed.url)
                    request(optionsDeleteUnconfirmed, deleteAllDocs);
                }
            }

        if (transactions >= 1) {
            res.send({
                "message": "Published Blocks to chain and deleted unconfirmed Transactions!"
            })
        } else {
            res.send({
                "message": "No unconfirmed transactions"
            })
        }




    }

    function deleteAllDocs(error, response, body) {
        console.log(body);
    }

    console.log("135 " + options.method + " " + options.url)
    request(options, getAllDocsCallback)


})

module.exports = router;