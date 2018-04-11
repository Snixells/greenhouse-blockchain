const express = require('express');
const router = express.Router();
const DatabaseBlockchain = require('../../couchdb.js');

// const DatabaseBlockchain = require('../../chaindb.js');

router.get('/', (req, res, next) => {
    // DatabaseBlockchain.getChain(result => {
    //     res.status(200).json(result);
    // }) 

    DatabaseBlockchain.getChain(result => {
        console.log(result);
    })

})

module.exports = router;