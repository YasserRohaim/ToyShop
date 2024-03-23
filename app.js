// import express
const express = require('express');
// const SwaggerUI = require('swagger-ui')
const cookieParser = require('cookie-parser');

// import dotenv to read .env file
require('dotenv').config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.redirect('/items')
})
// import routes
const itemsRoutes = require('./routes/itemRoutes');
app.use('/items',itemsRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users',userRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/cart',cartRoutes);


app.listen('3001', () => {
    console.log('Listening to port 3001..');
});
