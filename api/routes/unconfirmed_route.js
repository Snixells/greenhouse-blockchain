const express = require('express');
const router = express.Router();
const NodeCouchDb = require('node-couchdb');

const Transaction = require('../../Transaction');

const dbUnconfirmedName = "unconfirmed";
const viewFullUnconfirmed = "_design/unconfirmedFull/_view/unc";

const couch = new NodeCouchDb({
    auth: {
        user: 'Snixells',
        password: '5%QO8qSPyXq6#OQF90z*'
    }
});

router.get('/', (req, res, next) => {
    couch.get(dbUnconfirmedName, viewFullUnconfirmed).then(({ data, headers, status }) => {
        let responseArray = [];
        for (let i = 0; i < data.total_rows; i++) {
            responseArray.push(data.rows[i].value);
        }
        // console.log(responseArray);
        res.send(responseArray);
    })
})

router.get('/validate', (req, res, next) => {
    couch.get(dbUnconfirmedName, viewFullUnconfirmed).then(({ data, headers, status }) => {
        let unconfirmedTransactions = [];
        for(let i = 0; i < data.total_rows; i++){
            unconfirmedTransactions.push(data.rows[i].value);
        }
    })
})

router.post('/newTransaction', (req, res, next) => {
    const transaction = new Transaction({
        "data": "data"
    }, "", "")

    couch.insert(dbUnconfirmedName, transaction)
        .then(({ data, headers, status }) => {
            console.log("Data: " + data);
            console.log("Status: " + status)
        }, err => {
            console.log(err);
        })

    res.send(JSON.stringify(transaction));

    console.log(transaction);
})

router.post('/validate', (req, res, next) => {


}),
    module.exports = router;