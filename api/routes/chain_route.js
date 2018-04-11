const express = require('express');
const router = express.Router();
const NodeCouchDb = require('node-couchdb');
const bodyParser = require('body-parser');
const path = require('path');

// Database Configuration
const dbChainName = 'chain';
const viewUrl = '_design/chain/_view/full_chain';

const couch = new NodeCouchDb({
    auth: {
        user: 'Snixells',
        password: '5%QO8qSPyXq6#OQF90z*'
    }
});


router.get('/', (req, res, next) => {
    couch.get(dbChainName, viewUrl).then(({ data, headers, status }) => {
        console.log(JSON.stringify(data.rows));
        res.status(200).json(data.rows);
    }
    , err => {
        res.send(err);
    }
    )

});

module.exports = router;