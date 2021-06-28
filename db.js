const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'simcarddb',
});

// create db

// create table

module.exports = db;
