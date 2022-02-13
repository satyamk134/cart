const mongoose = require('mongoose');
const mysql = require('mysql');
// const config = require('../configs/db.config');

connectToDb = ()=>{
    /**
     * For local 
    */
   
   //mongodb+srv://admin:india_123@cluster0-xt9fw.mongodb.net/localshop?retryWrites=true&w=majority
   //console.log("url is",'mongodb://'+config.connection.database.host+':'+config.connection.database.port+'/'+config.connection.database.database)
   mongoose.connect('mongodb://localhost:27017/product', {
    useNewUrlParser: true
  });;
  //mongoose.connect(uri)
   //mongoose.connect('mongodb://localhost:27017/forum', {useNewUrlParser: true});
   //mongoose.connect('mongodb://user:Qwerty_123@cluster-cataloging-shard-00-02-5gmlz.mongodb.net:27017/catalog-v3?retryWrites=true&ssl=true&authSource=admin')
   mongoose.set('debug', true);
    mongoose.connection.on('connected', function() {
        console.log("Db is successfully connected")
    });
    mongoose.connection.on('error', function(err) {
        console.log("Error in connecting to the DB",err)
    });
    mongoose.connection.on('disconnected', function(err) {
        console.log("DB connection is disconneted",err)
    });
}

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    
    password: process.env.DB_PASS,
    database: 'shoppers'
    
  });
  
  mysqlConnection.connect((err) => {
    if (err) throw err;
    console.log('Connected! to mysql');
  });

  module.exports = {
    connectToDb,
    mysqlConnection

  }

