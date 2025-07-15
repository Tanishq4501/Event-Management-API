const seq = require('./db');
const {user,event,registration} = require('./models');
const express = require('express');
const app = express();

app.use(express.json());

//routes
const event_routes = require('./routes/eventroutes');
const user_routes = require('./routes/userroutes');
app.use('/api',event_routes);
app.use('/api',user_routes);

//Promise for connecting postgres db
(async () =>{
    try{
        await seq.authenticate();
        console.log('Database connected successfully!');
        await seq.sync(); //if table does not exist
        console.log('Models synchronized successfully!');
    }catch(error){
        console.error('Unable to connect to database: ',error);
    }
})();

module.exports = app;