const express = require('express');
const app = express();
const http = require('http');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const envConfig = require('./config/index')();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Host");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); 
    next();
});

app.use((req, res,next)=>{
    console.log("path is===>",req.path);
    next()
})

let productroutes = require('./src/modules/products/routes/index.router');
productroutes(app);

app.use(function(req,res){
    res.status(404).json({msg:'Resource Not Found'});
});
const port = 4002;
http.createServer(app).listen(port,()=>{
    console.log(`Cart is listening at ${port}`);
});
