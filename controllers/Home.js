const request = require('request');
const Helper = require('../helpers/transformData.js');
const api_key = 's-GMZ_xkw6CrkGYUWs1p';
const baseUrl = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES';
const stockResponse = {'MSFT': {'maxProfit': '', 'busyDay': '', 'averageData': []},
                      'GOOGL': {'maxProfit': '', 'busyDay': '', 'averageData': []},
                      'COF': {'maxProfit': '', 'busyDay': '', 'averageData': []},
                    'biggestLoser': ''};

module.exports = {
  getContent: function(req, res) {
    const url = Helper.buildRequest(api_key, baseUrl, '2017-01-01', '2017-06-30');

    request(url, function (err, response, body) {
      if (err) {
        console.log('Error calling /api/v3/datatables/WIKI/PRICES:', err);
      } else {
        // Console.log('body:', body);
        const jsonBody = JSON.parse(body);
        for (let i = 1; i <= 6; i++) {
          const msftAverages = Helper.calculateAverages('MSFT', i, jsonBody);
          const googlAverages = Helper.calculateAverages('GOOGL', i, jsonBody);
          const cofAverages = Helper.calculateAverages('COF', i, jsonBody);

          stockResponse.MSFT.averageData.push(msftAverages);
          stockResponse.GOOGL.averageData.push(googlAverages);
          stockResponse.COF.averageData.push(cofAverages);
        }
        // Get max profit data for MSFT, GOOGL, and COF
        const msftMaxProfit = Helper.calculateMaxProfit('MSFT', jsonBody);
        const googlMaxProfit = Helper.calculateMaxProfit('GOOGL', jsonBody);
        const cofMaxProfit = Helper.calculateMaxProfit('COF', jsonBody);
        // Get average volume and busy days for MSFT, GOOGL, and COF
        const msftBusyDays = Helper.calculateBusyDays('MSFT', jsonBody);
        const googlBusyDays = Helper.calculateBusyDays('GOOGL', jsonBody);
        const cofBusyDays = Helper.calculateBusyDays('COF', jsonBody);
        // Find the biggest loser of MSFT, GOOGL, and COF
        const biggestLoserResponseObj = Helper.calculateBiggestLoser(jsonBody);
        // Setting returned objects to overall stock response object
        stockResponse.MSFT.maxProfit = msftMaxProfit;
        stockResponse.GOOGL.maxProfit = googlMaxProfit;
        stockResponse.COF.maxProfit = cofMaxProfit;
        stockResponse.MSFT.busyDay = msftBusyDays;
        stockResponse.GOOGL.busyDay = googlBusyDays;
        stockResponse.COF.busyDay = cofBusyDays;
        stockResponse.biggestLoser = biggestLoserResponseObj;
        console.log('response: ' + JSON.stringify(stockResponse));
        // Passing stock response object to view index.ejs
        res.render('index', stockResponse);
      }
    });
  }
}
