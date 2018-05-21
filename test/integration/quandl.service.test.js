const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const base = 'https://www.quandl.com/api/v3';
const api_key = 's-GMZ_xkw6CrkGYUWs1p';
/**
* Unit tests for testing Quandl Wiki Prices GET service
*/
describe('GET /datatables/WIKI/PRICES', () => {
  it('Calls Quandl Price API and returns all price data for MSFT, COF, GOOGL from 1/1/17 to 6/30/17', (done) => {
    request.get(base + '/datatables/WIKI/PRICES?date.gte=2017-01-01&date.lte=2017-06-30&ticker=MSFT,GOOGL,COF&api_key=' + api_key, (err, res, body) => {
      res.statusCode.should.eql(200);
      res.headers['content-type'].should.contain('application/json');
      body = JSON.parse(body);
      body.datatable.should.not.equal(null);
      body.datatable.data.should.not.equal(0);
      body.datatable.should.include.keys(
        'data','columns'
      );
      done();
    });
  });
});
