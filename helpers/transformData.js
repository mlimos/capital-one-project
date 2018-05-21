module.exports = {
  /**
  * calculateAverages returns the average open and close data given a passed-in ticker and number month
  * @param {String} ticker: ticker name (IE: MSFT, GOOGL, COF)
  * @param {Integer} month: number month (IE: 1 for January, 2 for February, 3 for March, etc.)
  * @param {String} body: returned JSON response from the quandl API
  * @return {JSON Object} monthlyAverageData: JSON object with keys, month (string), averageOpen (decimal), averageClose(decimal)
  */
  calculateAverages: function (ticker, month, body) {
    // Filter entire JSON response by given month and ticker to limit data
    let tickerData = body.datatable.data.filter(function (el) {
      return el[1].split("-")[1] == '0' + month &&
        el[0] == ticker;
    });
    // If tickerData is greater than 0, calculate average open and close
    if (tickerData.length > 0) {
      const monthlyAverageData = {'month': '', 'average_open': '', 'average_close': ''};
      // Sum opening price
      const totalOpen = tickerData.reduce(function (sum, currentDay) {
        return sum + currentDay[2]
      }, 0);
      // Sum closing price
      const totalClose = tickerData.reduce(function (sum, currentDay) {
        return sum + currentDay[5];
      }, 0);
      // Calculate averages
      let averageOpen = totalOpen / tickerData.length;
      averageOpen = Math.round(averageOpen * 100) / 100;
      let averageClose = totalClose / tickerData.length;
      averageClose = Math.round(averageClose * 100) / 100;
      // Set calculations to returned JSON object
      monthlyAverageData.month = '2017' + '-0' + month;
      monthlyAverageData.average_open = averageOpen;
      monthlyAverageData.average_close = averageClose;

      return monthlyAverageData;
    } else {
      throw `Not able to compute averages for: ${ticker} in month ${month}`;
    }
  },
  /**
  * calculateMaxProfit returns the day and maximum profit (selling at high and buying at low)
  * for a given ticker
  * @param {String} ticker: ticker name (IE: MSFT, GOOGL, COF)
  * @param {String} body: returned JSON response from the quandl API
  * @return {JSON Object} maxProfitResponseObj: JSON object with keys, date (string), profit (decimal)
  */
  calculateMaxProfit: function(ticker, body) {
    // Filter entire JSON response by given ticker to limit data
    const tickerData = body.datatable.data.filter(function (el) {
      return el[0] == ticker;
    });
    // If tickerData is greater than 0, calculate max profit
    if (tickerData.length > 0) {
      const maxProfitResponseObj = {"date":"", "profit":""};
      let thisDate = '';
      let currentMaxProfit = 0;
      let diffBetweenHighAndLow = 0;
      // Loop through ticker data, calculate each day's profit, and compare it with the current maximum profit
      tickerData.forEach((dayofData) => {
        diffBetweenHighAndLow = dayofData[3] - dayofData[4];
        if (diffBetweenHighAndLow > currentMaxProfit) {
          currentMaxProfit = diffBetweenHighAndLow;
          thisDate = dayofData[1];
        }
      });
      currentMaxProfit = Math.round(currentMaxProfit * 100) / 100
      // Set max profit data to returned JSON object
      maxProfitResponseObj.date = thisDate;
      maxProfitResponseObj.profit = currentMaxProfit;

      return maxProfitResponseObj;
    } else {
      throw `Not able to get data for ticker ${ticker}`;
    }
  },
  /**
  * calculateBusyDays returns the average volume, busy days (all days that generated >= 10% volume), and volumes
  * associated to those days for a given ticker
  * @param {String} ticker: ticker name (IE: MSFT, GOOGL, COF)
  * @param {String} body: returned JSON response from the quandl API
  * @return {JSON Object} busyDaysResponseObj: JSON object with keys avgVolume (Decimal), allBusyDays (Array with JSON object of keys:
  * day (string) and volume (Decimal)
  */
  calculateBusyDays: function(ticker, body) {
    // Filter entire JSON response by given ticker to limit data
    let tickerData = body.datatable.data.filter(function (el) {
      return el[0] == ticker;
    });
    // If tickerData is greater than 0, calculate busy days
    if (tickerData.length > 0) {
      const busyDaysResponseObj = {'avgVolume': '', 'allBusyDays': []};
      let volumeObj = '';
      let daysGreaterThanVolume = [];
      // Sum volume
      let totalVolume = tickerData.reduce(function (sum, currentDay) {
        return sum + currentDay[6];
      }, 0);
      // Calculate average volume and round off
      let avgVolume = totalVolume / tickerData.length;
      avgVolume = Math.round(avgVolume * 100) / 100;
      // Calculate the volume with 10% increase
      let tenPercentMore = (avgVolume / 10) + avgVolume;
      // Loop through tickerData and find days that have a heavy volume
      tickerData.forEach((dayofData) => {
        if (dayofData[6] > tenPercentMore) {
          volumeObj = {'day': '', 'volume': 0};
          volumeObj.day = dayofData[1];
          volumeObj.volume = dayofData[6];
          daysGreaterThanVolume.push(volumeObj);
        }
      });
      // Set busy day data to returned JSON object
      busyDaysResponseObj.avgVolume = avgVolume;
      busyDaysResponseObj.allBusyDays = daysGreaterThanVolume;

      return busyDaysResponseObj;
    } else {
      throw `Not able to get data for ticker ${ticker}`
    }
  },
  /**
  * calculateBiggestLoser returns the ticker that had the greatest number of days where the closing price was
  * lower than the opening. It also returns the number of days this happened.
  * @param {String} body: returned JSON response from the quandl API
  * @return {JSON Object} biggestLoserResponseObj: JSON object with keys: ticker (string) and numDays (Integer)
  */
  calculateBiggestLoser: function (body) {
    const tickerData = body.datatable.data;
    const biggestLoserResponseObj = {'ticker': '', 'numDays': ''};
    let tickerMap = {'MSFT':0, 'GOOGL':0, 'COF':0};

    // Looping through ticker data to find which days closed with a stock price lower than opening price
    tickerData.forEach((dayofData) => {
      if (dayofData[5] < dayofData[2]) {
        tickerMap[dayofData[0]] += 1;
      }
    });

    let maxDays = 0;
    let tickerName = '';
    for (let ticker in tickerMap) {
      if (tickerMap[ticker] > maxDays) {
        maxDays = tickerMap[ticker];
        tickerName = ticker;
      }
    }
    // Set biggest loser data to returned JSON object
    biggestLoserResponseObj.ticker = tickerName;
    biggestLoserResponseObj.numDays = maxDays;

    return biggestLoserResponseObj;
  },
  /**
  * buildRequest returns the URL for the API call given an API key, URL base, start date, and end date
  * @param {String} api_key: API Key to interact with Quandl data
  * @param {String} baseUrl: Base of the Quandl URL
  * @param {String} startDate: Lower bound of date to capture Quandl data
  * @param {String} endDate: Upper bound of date to capture Quandl data
  * @return {String} URL : GET request URL
  */
  buildRequest: function (api_key, baseUrl, startDate, endDate) {
    let url = baseUrl + '?date.gte=' + startDate + '&date.lte=' + endDate + '&ticker=MSFT,GOOGL,COF' + '&api_key=' + api_key;

    return url;
  }
}
