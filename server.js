const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();


const chainRoutes = require('./api/routes/chain_route');
const unconfirmedRoutes = require('./api/routes/unconfirmed_route');

const morgan = require('morgan');

app.set('view engine', 'ejs');

app.use((morgan('dev')));
app.use(bodyParser.urlencoded({extended: true}))

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // OPTIONS request is sent by browsers to see which options are available => in this case PUT, POST, PATCH, DELETE, GET
    if(request === 'OPTIONS'){
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return response.status(200).json({});
    }

    // Next is needed so that the following code (routes, e.g.) will be executed
    next();
});

app.use('/chain', chainRoutes);

app.use('/unconfirmed', unconfirmedRoutes);

app.get('/', (req, res) => {
    res.send("Hello World");

})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});