const NodeCouchDb = require('node-couchdb');


const Transaction = require('./Transaction');
const Block = require('./Block');



let newBlock = new Block([]);

newBlock.addTransaction("hello");

console.log(newBlock);