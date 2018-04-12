const Blockchain = require('./Blockchain.js');
const Transaction = require('./Transaction.js');
const Block = require('./Block.js')
const DatabaseBlockchain = require('./chaindb.js');

let businessBlockchain = new Blockchain();

    // businessBlockchain.addCar("1", "Tesla", "Model 3", "0001");
    // businessBlockchain.addCar("1", "BMW", "M2 Coupe", "0002");
    // businessBlockchain.addCar("2", "Tesla", "Model X", "0003");
    // businessBlockchain.addCar("2", "Tesla", "Model S", "0004");
    // businessBlockchain.addCar("2", "BMW", "M4 Coupe", "0005");
    // businessBlockchain.addCar("1", "Tesla", "Model 3", "0006");
    // businessBlockchain.addCar("1", "BMW", "M2 Coupe", "0007");
    // businessBlockchain.addCar("2", "Tesla", "Model X", "0008");
    // businessBlockchain.addCar("1", "Tesla", "Model S", "0009");
    // businessBlockchain.addCar("2", "BMW", "M4 Coupe", "0010");
    // businessBlockchain.addCar("2", "Tesla", "Model X", "0008");
    // businessBlockchain.addCar("2", "Tesla", "Model 3", "0006");

    let newBlock = new Block();
    // newBlock.addTransaction("hello");

    // console.log(newBlock);


    // DatabaseBlockchain.getUnconfirmedDB(callback => {
    //     console.log(callback);
    // });

    // businessBlockchain.validateTransactions();

    // DatabaseBlockchain.checkWhetherDatabaseEmpty(callback => {
    //     if(callback)
    //         console.log("EMPTY");
    // });

    // DatabaseBlockchain.createGenesisBlock();

    // console.log(DatabaseBlockchain.checkNumberOfUnconfirmed(result => {
    //     console.log(result);
    // }))

    // DatabaseBlockchain.deleteTableData('blockchain', 'chain');

    // DatabaseBlockchain.createGenesisBlock();

    DatabaseBlockchain.sortChainByDate();

    
// ueryResults = businessBlockchain.queryCarID("0007");
// businessBlockchain.printQueryResults(queryResults);
// console.log("1. was chosen");
// businessBlockchain.transferCar("2", businessBlockchain.chooseQueryResult(1, queryResults));

// console.log(businessBlockchain.getOwnerFindByCarID("0006"));

// console.log(JSON.stringify(businessBlockchain, null, 3));

