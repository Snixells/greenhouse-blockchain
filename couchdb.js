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
const viewUrl = '_design/chain/_view/full_chain';

module.exports = {
    getChain(callback) {
        couch.get(dbChainName, viewUrl).then(({ data, headers, status }) => {
            console.log(JSON.stringify(data.rows));
        }
        )
    }
}

