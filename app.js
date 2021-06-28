const express = require('express');
const db = require('./db');
const fetch = require('node-fetch');
const app = express();

// 1) MIDDLEWARES

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.get('/sim-cards', (req, res) => {
  let sql = 'SELECT * FROM simcards';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json({
      sucsess: 'true',
      data: results,
    });
  });
});

// Createing DataBase Tables
// Creating SimCard Table
app.post('/createdbtable', (req, res) => {
  let createTableSql =
    'CREATE TABLE simcards(id int AUTO_INCREMENT, name VARCHAR(255) UNIQUE, PRIMARY KEY (id))';
  db.query(createTableSql, (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).json({
      sucsess: 'true',
      massege: 'sim-card db table was created',
    });
  });
});
// Creationg Orders Table
app.post('/createordersdbtable', (req, res) => {
  let Sql =
    'CREATE TABLE orders(id int AUTO_INCREMENT, simId int, customerId int, createdAt DATETIME NOT NULL DEFAULT NOW(), status varchar(255) DEFAULT "Pending", PRIMARY KEY (id))';
  db.query(Sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).json({
      sucsess: 'true',
      massege: 'order db table was created',
      result,
    });
  });
});

//Costomer Table

app.post('/createcustomerdbtable', (req, res) => {
  let Sql =
    'CREATE TABLE customer(id int AUTO_INCREMENT, name VARCHAR(255), address VARCHAR(255), city VARCHAR(255), zipCode int, country VARCHAR(255),PRIMARY KEY (id))';
  db.query(Sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).json({
      sucsess: 'true',
      massege: 'customer db table was created',
    });
  });
});

app.post('/deleteorderTable', (req, res) => {
  db.query('DROP TABLE orders', (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).json({
      sucsess: 'true',
      massege: 'order db table was deleted',
    });
  });
});

// Create SimCard

app.post('/createsimcard', (req, res) => {
  const name = req.body.name;
  console.log(name);
  let simCard = { name };
  let sql = 'INSERT INTO simcards SET ?';
  let query = db.query(sql, simCard, (err, result) => {
    if (err) {
      // throw err;
      return res.status(500).json({
        sucsess: false,
        error: err,
      });
    }
    res.status(200).json({
      sucsess: 'true',
      massege: 'sim card created...',
    });
  });
});

// Create New Order

app.post('/order/:simID/:customerID', (req, res) => {
  let sqlcustomer = `SELECT * FROM customer WHERE id = ${req.params.customerID}`;
  let m = db.query(sqlcustomer, (err, resultA) => {
    if (err) {
      throw err;
    }
    let sql = 'INSERT INTO orders SET ?';
    const deAdrees = {
      address: resultA.query,
      city: resultA.city,
      zipCode: resultA.zip,
      country: resultA.country,
    };
    const order = {
      simId: req.params.simID,
      customerId: req.params.customerID,
    };
    let query = db.query(sql, order, (err, result) => {
      if (err) throw err;
      const newOrder = Object.assign(order, {
        deliveryAddress: {
          address: resultA[0].query,
          city: resultA[0].city,
          zipCode: resultA[0].zip,
          country: resultA[0].country,
        },
      });
      res.status(200).json({
        sucsess: 'true',
        data: {
          newOrder,
        },
      });
    });
  });
});

app.post('/createCustomer', (req, res) => {
  fetch('http://ip-api.com/json/24.48.0.1')
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      const order = {
        name: req.body.name,
        address: json.query,
        city: json.city,
        zipCode: '0950',
        country: json.country,
      };
      let sql = 'INSERT INTO customer SET ?';
      let query = db.query(sql, order, (err, result) => {
        if (err) throw err;
        res.status(200).json({
          sucsess: 'true',
          data: order,
        });
      });
    });
});
// app.post
// `SELECT * FROM customer WHERE id = ${req.params.customerID}`;
app.patch('/orders/:id', (req, res) => {
  let orderSql = `SELECT * FROM orders WHERE id = ${req.params.id}`;
  let orderQuery = db.query(orderSql, (err, resultA) => {
    if (err) {
      throw err;
    }
    let sql = `UPDATE orders SET status = '${req.body.status}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        sucsess: 'true',
        data: resultA,
      });
    });
  });
});

app.get('/orders', getOrders);

function getOrders(req, res, next) {
  const limit = req.query.limit;
  const page = req.query.page;
  const offset = (page - 1) * limit;
  const prodsQuery =
    'SELECT * FROM orders limit ' + limit + ' OFFSET ' + offset;
  let query = db.query(prodsQuery, (err, results) => {
    // jResult = {
    //   products_page_count: results.length,
    //   page_number: page,
    //   products: results,
    // };

    if (err) {
      return res.status(500).json({
        sucsess: false,
        error: err,
      });
    }
    if (!results) {
      return res.status(200).json({
        sucsess: 'true',
        data: {},
      });
    }
    res.status(200).json({
      sucsess: 'true',
      data: results,
    });
  });
}

module.exports = app;
