// Class for the Blocks the Chain will consist of later

const SHA256 = require('crypto-js/sha256');
const Transaction = require('./Transaction');


class Block {
    constructor(transactions, previousHash = '') {
        this.timestamp = this.getDate();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    // Calculating Hash for Transaction
    calculateHashTransaction(transaction) {
        return SHA256(transaction.timestamp + JSON.stringify(transaction.data)).toString();
    }

    // Calculating Hash for Block -> using hashes of all transactions inside that block
    calculateHash(transactions) {
        let hashNumber = "";
        for (let i = 0; i < this.transactions.length; i++) {
            hashNumber += JSON.stringify(transactions[i].hash);
        }
        hashNumber += this.nonce;

        return SHA256(hashNumber).toString();
    }

    addTransaction(data){
        this.transactions.push(new Transaction(data));
    }

    getDate() {
        let timestamp = new Date();
        let dd = timestamp.getDate();
        let mm = timestamp.getMonth() + 1;
        let yyyy = timestamp.getFullYear();
        let hh = timestamp.getHours();
        let min = timestamp.getMinutes();
        let ss = timestamp.getSeconds();
        let ms = timestamp.getMilliseconds();

        if (dd < 10)
            dd = '0' + dd

        if (mm < 10)
            mm = '0' + mm

        if (hh < 10)
            hh = '0' + mm

        if (min < 10)
            min = '0' + min

        if (ss < 10)
            ss = '0' + ss

        if (ms < 10) {
            ms = '000' + ms;
        }

        else if (ms < 100) {
            ms = '00' + ms;
        }

        else if (ms < 1000) {
            ms = '0' + ms;
        }
        return yyyy + '/' + mm + '/' + dd + '/' + hh + '/' + min + '/' + ss + '/' + ms;
    }
}

module.exports = Block;