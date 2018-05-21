const Home = require('../../controllers/Home');
const Helper = require('../../helpers/transformData.js');
const quandlData = require('../fixtures/quandlData.json');
const chai = require('chai');
const expect = chai.expect;
/**
* Unit tests for testing ./helpers/transformData.js
*/
describe('Calculate MSFT Average Open and Close', () => {
  it('Calculates MSFT average open and close data for the month of April', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateAverages('MSFT', 4, obj);
    responseObj.average_open.should.equal(65.83);
    responseObj.average_close.should.equal(65.61);
    done();
  });
});
describe('Calculate GOOGL Average Open and Close', () => {
  it('Calculates GOOGL average open and close data for the month of April', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateAverages('GOOGL', 4, obj);
    responseObj.average_open.should.equal(845.35);
    responseObj.average_close.should.equal(842.97);
    done();
  });
});
describe('Calculate COF Average Open and Close', () => {
  it('Calculates COF average open and close data for the month of April', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateAverages('COF', 4, obj);
    responseObj.average_open.should.equal(86.13);
    responseObj.average_close.should.equal(85.53);
    done();
  });
});
describe('Error throws for Average Open and Close', () => {
  it('Given an invalid month or ticker, throws an error', (done) => {
    const obj = quandlData.all.success.body;
    try {
      let responseObj = Helper.calculateAverages('COF', 7, obj);
    } catch (e) {
      expect(e).to.equal('Not able to compute averages for: COF in month 7');
    }
    done();
  });
});
describe('Calculate Max Profit for MSFT', () => {
  it('Calculates the day where MSFT had the maximum profit', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateMaxProfit('MSFT', obj);
    responseObj.date.should.equal("2017-05-22");
    responseObj.profit.should.equal(1);
    done();
  });
});
describe('Calculate Max Profit for Google', () => {
  it('Calculates the day where GOOGL had the maximum profit', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateMaxProfit('GOOGL', obj);
    responseObj.date.should.equal("2017-05-08");
    responseObj.profit.should.equal(13.60);
    done();
  });
});
describe('Calculate Max Profit for COF', () => {
  it('Calculates the day where COF had the maximum profit', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateMaxProfit('COF', obj);
    responseObj.date.should.equal("2017-04-03");
    responseObj.profit.should.equal(2.24);
    done();
  });
});
describe('Error throw when calculating max profit', () => {
  it('Given an invalid ticker, throws an error', (done) => {
    const obj = quandlData.all.success.body;
    try {
      let responseObj = Helper.calculateMaxProfit('FB', obj);
    } catch (e) {
      expect(e).to.equal('Not able to get data for ticker FB');
    }
    done();
  });
});
describe('Calculate Busy Days for MSFT', () => {
  it('Calculates the days where MSFT is most busy as well as the average volume', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateBusyDays('MSFT', obj);
    responseObj.avgVolume.should.equal(20269618.67);
    responseObj.allBusyDays.length.should.equal(2);
    responseObj.allBusyDays[0].day.should.equal("2017-05-18");
    responseObj.allBusyDays[0].volume.should.equal(24789790);
    responseObj.allBusyDays[1].day.should.equal("2017-05-19");
    responseObj.allBusyDays[1].volume.should.equal(26496478);
    done();
  });
});
describe('Calculate Busy Days for GOOGL', () => {
  it('Calculates the days where GOOGL is most busy as well as the average volume', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateBusyDays('GOOGL', obj);
    responseObj.avgVolume.should.equal(1513655.17);
    responseObj.allBusyDays.length.should.equal(2);
    responseObj.allBusyDays[0].day.should.equal("2017-05-04");
    responseObj.allBusyDays[0].volume.should.equal(1934652);
    responseObj.allBusyDays[1].day.should.equal("2017-05-08");
    responseObj.allBusyDays[1].volume.should.equal(1863198);
    done();
  });
});
describe('Calculate Busy Days for COF', () => {
  it('Calculates the days where COF is most busy as well as the average volume', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateBusyDays('COF', obj);
    responseObj.avgVolume.should.equal(2428201.8);
    responseObj.allBusyDays.length.should.equal(2);
    responseObj.allBusyDays[0].day.should.equal("2017-04-03");
    responseObj.allBusyDays[0].volume.should.equal(3158771);
    responseObj.allBusyDays[1].day.should.equal("2017-05-04");
    responseObj.allBusyDays[1].volume.should.equal(3154418);
    done();
  });
});
describe('Error thrown when calculating busy days', () => {
  it('Given an invalid ticker, throws an error', (done) => {
    const obj = quandlData.all.success.body;
    try {
      let responseObj = Helper.calculateBusyDays('FB', obj);
    } catch (e) {
      expect(e).to.equal('Not able to get data for ticker FB');
    }
    done();
  });
});
describe('Calculate Biggest Loser', () => {
  it('Calculates the biggest overall loser between MSFT, GOOGL, and COF', (done) => {
    const obj = quandlData.all.success.body;
    var responseObj = Helper.calculateBiggestLoser(obj);
    responseObj.ticker.should.equal('COF');
    responseObj.numDays.should.equal(5);
    done();
  });
});
