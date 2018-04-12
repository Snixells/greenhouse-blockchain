const express = require('express');
const router = express.Router();
const nano = require('nano')

const Transaction = require('../../Transaction');

router.get('/', (req, res, next) => {

})

router.post('/newTransaction', (req, res, next) => {
    const transaction = new Transaction({
        "data" : "data"
    })  

    console.log(transaction);
})

router.post('/validate', (req, res, next) => {
    

}),
    module.exports = router;