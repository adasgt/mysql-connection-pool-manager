'use strict';

// Load assertions & framework
const Assert = require('assert');
const Promise = require("bluebird");
const Chai = require('chai');

// Load module
const PoolManager = require('./../../');

// An example options configuration
const options = {
  idleCheckInterval: 1000
  , maxConnextionTimeout: 30000
  , idlePoolTimeout: 3000
  , errorLimit: 5
  , preInitDelay: 50
  , sessionTimeout: 60000
  , onConnectionAcquire: () => {}
  , onConnectionConnect: () => {}
  , onConnectionEnqueue: () => {}
  , onConnectionRelease: () => {}
  , mySQLSettings: {
    host: 'localhost'
    , user: 'root'
    , password: ''
    , database: 'database_test'
    , port: '3306'
    , socketPath: '/var/run/mysqld/mysqld.sock'
    , charset: 'utf8'
    , multipleStatements: true
    , connectTimeout: 15000
    , acquireTimeout: 10000
    , waitForConnections: true
    , connectionLimit: 1000
    , queueLimit: 15000
    , debug: false
  }
}

// Initialising the instance
const mySQL = PoolManager(options);

describe('mysql', function() {

  before(function() {
    this.timeout(30000);
    for(var i = 0; i < 10000; i++) {
      var count = i;
      mySQL.query(
        `INSERT INTO test_table VALUES (${count}, ${count});`
        , (res, msg) => {});
    }
  });

  for(var i = 0; i < 10000; i++) {
    var count = i;
    it(`pool query test - many connections`, function() {
      this.timeout(30000);
      return new Promise(function(resolve, reject) {
        mySQL.query(`SELECT * FROM test_table WHERE column_one=${count}`, (res, msg) => {
          console.log(res,msg);
          res.length > 0 ? resolve() : reject();
        })
      });
    });
  }

});
