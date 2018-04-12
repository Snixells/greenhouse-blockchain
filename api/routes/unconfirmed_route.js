const Transaction = require('../../Transaction');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

})

router.post('/newTransaction', (req, res, next) => {
    const transaction = new Transaction({
        "data" : "data"
    })  
})

router.post('/validate', (req, res, next) => {
    

}),
    module.exports = router;