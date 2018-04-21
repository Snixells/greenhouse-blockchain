const express = require('express');
const request = require('request');
const router = express.Router();

const Transaction = require('../../Transaction');

const options = {
    url: 'url',
    headers: {
        'Authorization': process.env.DB_AUTHORIZATION,
        'Referer': '',
        'Content-Type': ''
    },
    method: 'GET'
};

// const couch = new NodeCouchDb({
//     auth: {
//         user: 'Snixells',
//         password: '5%QO8qSPyXq6#OQF90z*'
//     }
// });

router.get('/', (req, res, next) => {
    // couch.get(dbUnconfirmedName, viewFullUnconfirmed).then(({ data, headers, status }) => {
    //     let responseArray = [];
    //     for (let i = 0; i < data.total_rows; i++) {
    //         responseArray.push(data.rows[i].value);
    //     }
    //     // console.log(responseArray);
    //     res.send(responseArray);
    // })

    options.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED + process.env.DB_VIEW_FULL_UNCONFIRMED;

    function callback(error, response, body) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    }

    request(options, callback);

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
        "data": "data"
    }, "", "")

    options.url = process.env.DB_HOST + process.env.DB_UNCONFIRMED;

    // Request options
    // options.url += '-d \' {"name":"Jane"}\'';
    // options.url += JSON.stringify('{"name":"Jane"}');
    options.method = 'POST';
    console.log("JSON : " + options.json);
    options.headers.Referer = process.env.DB_HOST;
    // options.headers["Content-Type"] = 'multipart/form-data';
    options.headers["Content-Type"] = 'application/json';
    // options.headers["json"] = JSON.stringify(transaction);
    options.body = JSON.stringify(transaction);



    function callback(error, response, body) {
        // Reponse Options
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
        console.log(options.url);
    }

    request(options, callback);


    // couch.insert(dbUnconfirmedName, transaction)
    // .then(({ data, headers, status }) => {
    //     console.log("Data: " + data);
    //     console.log("Status: " + status)
    // }, err => {
    //     console.log(err);
    // })

    // res.send(JSON.stringify(transaction));

    console.log(transaction);
})

router.post('/validate', (req, res, next) => {


}),
    module.exports = router;