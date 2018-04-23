const express = require('express');
const request = require('request');
const router = express.Router();

const Transaction = require('../../Transaction');

const optionsPOSTNewTransaction = {
    url: process.env.DB_HOST + process.env.DB_UNCONFIRMED,
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'POST'
}

const optionsGetUnconfirmedView = {
    url: process.env.DB_HOST + process.env.DB_UNCONFIRMED + process.env.DB_VIEW_FULL_UNCONFIRMED,
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Content-Type': 'application/json'
    },
    method: 'GET'
};

router.get('/', (req, res, next) => {

    function callback(error, response, body) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    }

    request(optionsGetUnconfirmedView, callback);

})

router.get('/validate', (req, res, next) => {
    couch.get(dbUnconfirmedName, viewFullUnconfirmed).then(({ data, headers, status }) => {
        let unconfirmedTransactions = [];
        for (let i = 0; i < data.total_rows; i++) {
            unconfirmedTransactions.push(data.rows[i].value);
        }
    })
})

router.post('/newTransaction', (req, res, next) => {

        // Creating the new transaction
        const transaction = new Transaction({
            "lotsofdata": "data",
            "randomnumber": Math.random()
        }, "", "")


        // Adding transaction to http body
        optionsPOSTNewTransaction.body = JSON.stringify(transaction);

        function callback(error, response, body) {
            // Reponse Options
            res.setHeader('Content-Type', 'application/json');
            res.send(body);
        }

        request(optionsPOSTNewTransaction, callback);
})

router.post('/validate', (req, res, next) => {

}),
    module.exports = router;