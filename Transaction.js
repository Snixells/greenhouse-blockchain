// Class for the Transaction 

const SHA256 = require('crypto-js/sha256');

class Transaction {

    constructor(data, timestamp, hash) {
        // if (this.timestamp === "")
        if(timestamp == "")
            this.timestamp = this.getDate();
        else
            this.timestamp = timestamp;

        if (hash == "")
            this.hash = this.calculateHash();
        else
            this.hash = hash;
        this.data = data;
        console.log(this.hash);
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

    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.data)).toString();
    }
}

module.exports = Transaction;