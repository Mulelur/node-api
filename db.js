const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'simcarddb',
});

// db.connect();

// create db

// create table

module.exports = db;
