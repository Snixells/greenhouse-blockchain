const NodeCouchDb = require('node-couchdb');
const bodyParser = require('body-parser');

const couch = new NodeCouchDb({
    auth: {
        user: 'Snixells', 
        password: '5%QO8qSPyXq6#OQF90z*'
    }
});

const dbChainName = 'chain';
const dbUnconfirmedName = 'unconfirmed';

module.exports = {
    
}

