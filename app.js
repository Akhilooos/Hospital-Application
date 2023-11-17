
const express = require('express');
const morgan = require('morgan');
const app = new express();
app.use(morgan('dev'));

const route = require("./routes/routes.js");
app.use('/api',route);

require('dotenv').config();
const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})

