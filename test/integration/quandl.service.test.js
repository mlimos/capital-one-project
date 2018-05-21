const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const base = 'https://www.quandl.com/api/v3';
const api_key = 's-GMZ_xkw6CrkGYUWs1p';

describe('GET /datatables/WIKI/PRICES', () => {
  it('Calls Quandl Price API and returns all price data for MSFT, COF, GOOGL from 1/1/17 to 6/30/17', (done) => {
    request.get(base + '/datatables/WIKI/PRICES?date.gte=2017-01-01&date.lte=2017-06-30&ticker=MSFT,GOOGL,COF&api_key=' + api_key, (err, res, body) =>{
     // there should be a 200 status code
     res.statusCode.should.eql(200);
     // the response should be JSON
     res.headers['content-type'].should.contain('application/json');
     // parse response body
     body = JSON.parse(body);
     // the JSON response body should have a
     // key-value pair of {"status": "success"}
     body.datatable.should.not.equal(null);
     // the JSON response body should have a
     // key-value pair of {"data": [3 movie objects]}
     body.datatable.data.should.not.equal(0);
     // the first object in the data array should
     // have the right keys
     body.datatable.should.include.keys(
       'data','columns'
     );
     done();
    });
  });
});
