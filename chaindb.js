const rethinkdb = require('rethinkdb');
const Blockchain = require('./Blockchain.js');
const Block = require('./Block');
const Transaction = require('./Transaction')

const host = 'localhost';
const port = 28015;
const dbUsed = 'blockchain';
const tableUsedChain = 'chain';
const tableUsedUnconfirmed = 'unconfirmed';

// DELETE AND WRITE SOMEWHERE ELSE LATER
const maxUnverifiedTransactions = 2;

module.exports = {

    // CHAIN DATABASE

    insertToChainDatabase(block) {
        // Connecting to database
        let connection = null;
        rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
            if (err) throw err;
            connection = conn;

            // Add the new mined block to the chain database
            rethinkdb.db(dbUsed).table(tableUsedChain).insert([
                block
            ]).run(connection, (err, result) => {
            // ]).indexCreate('timestamp').run(connection, (err, result) => {                
                if (err) throw err;
            })

        })
    },

    createGenesisBlock(){
        let genesisBlock = new Block("GenesisBlock", '');
        this.insertToChainDatabase(genesisBlock);
    },

    getChain(callback) {
        // Connecting to database
        let connection = null;
        rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
            if (err) throw err;
            connection = conn;
            rethinkdb.db(dbUsed).table(tableUsedChain).run(connection, (err, cursor) => {
                if (err) throw err;
                cursor.toArray((err, result) => {
                    if (err) throw err;
                    callback(result);
                })
            })
        })

    },

    sortChainByDate(){
        this.sortDBByDate(dbUsed, tableUsedChain);
    },


    // UNCONFIRMED DATABASE

    insertToUnconfirmedDatabase(data) {
        // Connecting to database
        let connection = null;
        rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
            if (err) throw err;
            connection = conn;

            // Add the new mined block to the chain database
            rethinkdb.db(dbUsed).table(tableUsedUnconfirmed).insert([
                data
            ]).run(connection, (err, result) => {
                if (err) throw err;
            })

        })

        this.validateUnconfirmedTransactions();
    },

    getUnconfirmedDB(callback) {
        let connection = null;
        rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
            if (err) throw err;
            connection = conn;

            // rethinkdb.db(dbUsed).table(tableUsedUnconfirmed).orderBy({index: 'date'}).run(connection, (err, cursor) => {
            rethinkdb.db(dbUsed).table(tableUsedUnconfirmed).run(connection, (err, cursor) => {

            if (err) throw err;
                cursor.toArray((err, result) => {
                    if (err) throw err;
                    callback(result);
                })
            })
        })
    },

    validateUnconfirmedTransactions(){
        let countUnconfirmed; 
        this.checkNumberOfUnconfirmed(result => {
            countUnconfirmed = result;
            if(countUnconfirmed > maxUnverifiedTransactions ){
                this.createTransactionsFromDatabase(result => {
                    this.createBlockFromTransactions(result);
                })
            }
        })
    },

    sortUnconfirmedByDate(){
        this.sortDBByDate(dbUsed, tableUsedUnconfirmed);
    },


    // CREATING TRANSACTIONS AND BLOCKS

    createTransactionsFromDatabase(callback) {
        let unvalidatedTransactions, transactionsToVerify = [];
        this.getUnconfirmedDB(result => {
            unvalidatedTransactions = result;
            for (let i = 0; i < unvalidatedTransactions.length; i++) {
                transactionsToVerify.push(new Transaction(unvalidatedTransactions[i].data))
            };
            callback(transactionsToVerify);
        });
    },


    createBlockFromTransactions(transactions) {
        let unvalidatedTransactions;
        this.createTransactionsFromDatabase(callback => {
            newBlock = new Block(callback);
            newBlock.hash = newBlock.calculateHash(callback);
            this.insertToChainDatabase(newBlock);
            this.deleteTableData(dbUsed, tableUsedUnconfirmed);
        })
    },

    checkNumberOfUnconfirmed(callback){
        this.getUnconfirmedDB(result => {
            callback(result.length);
        })
    },


    // ADDITIONAL HELPERS 

    deleteTableData(dbUsed, tableUsed) {
        let connection = null;
        rethinkdb.connect({ host: host, port: port }, (err, conn) => {
            if (err) throw err;
            connection = conn;

            rethinkdb.db(dbUsed).table(tableUsed).delete().run(connection);
        })
    },

    // checkWhetherDatabaseEmpty(callback) {
    //     this.getUnconfirmedDB(result => {
    //         if (result.length = 0){
    //             callback(true);
    //         } else 
    //             callback(false);
    //     })
    // },

    sortDBByDate(dbUsed, tableUsed){
        let connection = null;
        rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
            if (err) throw err;
            connection = conn;

            rethinkdb.db(dbUsed).table(tableUsed).get(1)('transactions').run(connection, callback => {
                console.log("CALLBACK: " + callback);
            });
        })
    },
}






