const request = require('request');
const Helper = require('../helpers/transformData.js');
const api_key = 's-GMZ_xkw6CrkGYUWs1p';
const baseUrl = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES';

module.exports = {
  /**
  * getContent calls the Quandl wiki stock prices API for time period 1/1/2017 to 6/30/2017 for the three tickers:
  * COF, GOOGL, and MSFT. Calculations are done on the response data using functions in the ./helper/transformData.js
  * @return {JSON Object} stockResponse: JSON object with MSFT, GOOGL, and COF data
  */
  getContent: function (req, res) {
    // JSON oject that will be returned with data to our index.ejs view
    const stockResponse = {'MSFT': {'maxProfit': '', 'busyDay': '', 'averageData': []},
                          'GOOGL': {'maxProfit': '', 'busyDay': '', 'averageData': []},
                          'COF': {'maxProfit': '', 'busyDay': '', 'averageData': []},
                        'biggestLoser': ''};
    // Build API GET request to Quandl service
    const url = Helper.buildRequest(api_key, baseUrl, '2017-01-01', '2017-06-30');
    // API request to Quandl Wiki Stock prices
    request(url, function (err, response, body) {
      if (err) {
        console.log('Error calling /api/v3/datatables/WIKI/PRICES:', err);
      } else {
        // Parsing JSON body so it is readable for JavaScript
        const quandlBody = JSON.parse(body);
        // Calculate average open and close data for MSFT, GOOGL, and COF and, set returned objects to overall stock response object
        try {
          for (let i = 1; i <= 6; i++) {
            const msftAverages = Helper.calculateAverages('MSFT', i, quandlBody);
            stockResponse.MSFT.averageData.push(msftAverages);
            const googlAverages = Helper.calculateAverages('GOOGL', i, quandlBody);
            stockResponse.GOOGL.averageData.push(googlAverages);
            const cofAverages = Helper.calculateAverages('COF', i, quandlBody);
            stockResponse.COF.averageData.push(cofAverages);
          }
        }
        catch(e) {
          console.log(e);
        }
        // Get max profit data for MSFT, GOOGL, and COF and, set returned objects to overall stock response object
        try {
          const msftMaxProfit = Helper.calculateMaxProfit('MSFT', quandlBody);
          stockResponse.MSFT.maxProfit = msftMaxProfit;
          const googlMaxProfit = Helper.calculateMaxProfit('GOOGL', quandlBody);
          stockResponse.GOOGL.maxProfit = googlMaxProfit;
          const cofMaxProfit = Helper.calculateMaxProfit('COF', quandlBody);
          stockResponse.COF.maxProfit = cofMaxProfit;
        } catch (e) {
          console.log(e);
        }
        // Get average volume and busy days for MSFT, GOOGL, and COF, and set returned objects to overall stock response object
        try {
          const msftBusyDays = Helper.calculateBusyDays('MSFT', quandlBody);
          stockResponse.MSFT.busyDay = msftBusyDays;
          const googlBusyDays = Helper.calculateBusyDays('GOOGL', quandlBody);
          stockResponse.GOOGL.busyDay = googlBusyDays;
          const cofBusyDays = Helper.calculateBusyDays('COF', quandlBody);
          stockResponse.COF.busyDay = cofBusyDays;
        } catch (e) {
          console.log(e);
        }
        // Find the biggest loser of MSFT, GOOGL, and COF, and set returned object to overall stock response object
        try {
          const biggestLoserResponseObj = Helper.calculateBiggestLoser(quandlBody);
          stockResponse.biggestLoser = biggestLoserResponseObj;
        } catch (e) {
          console.log(e);
        }
        // Passing stock response object to view index.ejs
        res.render('index', stockResponse);
      }
    });
  }
}
