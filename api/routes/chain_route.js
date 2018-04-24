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

const optionsGetChainView = {
    url: process.env.DB_HOST + process.env.DB_CHAIN + process.env.DB_VIEW_FULL_CHAIN,
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'GET'
}

const optionsGetUnconfirmedView = {
    url: process.env.DB_HOST + process.env.DB_UNCONFIRMED + process.env.DB_VIEW_FULL_UNCONFIRMED,
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'GET'
}

const optionsPOSTNewBlock = {
    url: process.env.DB_HOST + process.env.DB_CHAIN,
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'POST'
}

const optionsDeleteUnconfirmed = {
    url: 'url',
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'DELETE'
}

const optionsGetUnconfirmedAllDocs = {
    url: process.env.DB_HOST + process.env.DB_UNCONFIRMED + "_all_docs",
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'GET'
}

const optionsGetLatestBlockChain = {
    url: process.env.DB_HOST + process.env.DB_CHAIN + "_find",
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'POST',
    json: true, 
    body: {
        "selector": {
            "timestamp": {
                "$gt": "2018"
            }
        },
        "fields": [
            "timestamp",
            "hash"
        ],
        "limit": 1,
        "sort": [{ "timestamp": "desc" }]
    }
}


// Get the whole chain 
router.get('/', (req, res, next) => {

    function sendBodyCallback(error, response, body) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    }

    request(optionsGetChainView, sendBodyCallback);
});


// Create new Block consisting of ../unconfirmed Transaction
router.post('/newBlock', (req, res, next) => {

    function getUnconfirmedTransactionsCallback(error, response, body) {
        let unconfirmedTransansactions = [];
        let newBlock = new Block('ahc');

        jsonResponseTransactions = JSON.parse(body);

        // Getting prevBlockHash
        function getPrevBlockHashCallback(hashErr, hashResponse, hashBody) {
            console.log(hashBody.docs[0].hash);
            if (jsonResponseTransactions.total_rows >= 0) {
                // Adding all transactions to newBlock
                for (let i = 0; i < jsonResponseTransactions.total_rows; i++) {
                    let transactionJson = jsonResponseTransactions.rows[i].value;
                    newBlock.addTransaction(transactionJson.data, transactionJson.timestamp, transactionJson.hash);
                }

                if (newBlock.transactions.length > 1) {
                    // Calculating newBLock hash
                    newBlock.calculateHash();

                    // Adding prevBlock Hash to new Block
                    newBlock.previousHash = hashBody.docs[0].hash

                    // Adding block to http body (to post it to chain)
                    optionsPOSTNewBlock.body = JSON.stringify(newBlock);

                    // Calling http request function to publish block
                    request(optionsPOSTNewBlock, postBlockToChainCallback);
                }
            } else {
                res.send({
                    "message": "No unconfirmed Transactions"
                })
            }

        }
        request(optionsGetLatestBlockChain, getPrevBlockHashCallback)
    }

    // POSTing Block to new doc on chain
    function postBlockToChainCallback(error, response, body) {
        console.log("Block to DB: " + body);
    }

    request(optionsGetUnconfirmedView, getUnconfirmedTransactionsCallback);

    // Now deleting all the unconfirmed transactions which are beeing published to the chain (as a block)

    // Outer Function gets the rev's and id's from the transactions
    function getAllDocsUnconfirmedCallback(error, response, body) {

        allDocsUnconfirmedJson = JSON.parse(body);

        let transactions = 0;

        for (let i = 0; i < allDocsUnconfirmedJson.total_rows; i++) {
            if (allDocsUnconfirmedJson.rows[i].key === process.env.DB_VIEW_KEY_FULL_UNCONFIRMED) {
                continue
            } else {
                transactions++;
                optionsDeleteUnconfirmed.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + allDocsUnconfirmedJson.rows[i].id + '?rev=' + allDocsUnconfirmedJson.rows[i].value.rev;
                console.log("109 " + optionsDeleteUnconfirmed.url);
                console.log("114 " + optionsDeleteUnconfirmed.method + " " + optionsDeleteUnconfirmed.url)
                request(optionsDeleteUnconfirmed, deleteAllDocsCallback);
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

    function deleteAllDocsCallback(error, response, body) {
        console.log(body);
    }

    console.log("135 " + options.method + " " + options.url)
    request(optionsGetUnconfirmedAllDocs, getAllDocsUnconfirmedCallback)


})

module.exports = router;