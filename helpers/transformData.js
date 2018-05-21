module.exports = {
  calculateAverages: function (ticker, month, body) {
    const monthlyAverageData = {'month': '', 'average_open': '', 'average_close': ''};
    let tickerData = body.datatable.data.filter(function (el) {
      return el[1].split("-")[1] == '0' + month &&
            el[0] == ticker;
    });
    const totalOpen = tickerData.reduce(function (sum, pc) {
      return sum + pc[2]
    }, 0);
    const totalClose = tickerData.reduce(function (sum, pc) {
      return sum + pc[5];
    }, 0);
    let averageOpen = totalOpen / tickerData.length;
    averageOpen = Math.round(averageOpen * 100) / 100;
    let averageClose = totalClose / tickerData.length;
    averageClose = Math.round(averageClose * 100) / 100;
    monthlyAverageData.month = '2017' + '-0' + month;
    monthlyAverageData.average_open = averageOpen;
    monthlyAverageData.average_close = averageClose;
    return monthlyAverageData;
  },
  calculateMaxProfit: function(ticker, body) {
    var maxProfitResponseObj = {"date":"", "profit":""};
    var tickerData = body.datatable.data.filter(function (el) {
      return el[0] == ticker;
    });

    var date = '';
    var diff = 0;
    var thisDiff = 0;
    for (var i = 0; i < tickerData.length; i++) {
      thisDiff = tickerData[i][3] - tickerData[i][4];
      if (thisDiff > diff) {
        diff = thisDiff;
        date = tickerData[i][1];
      }
    }
    diff = Math.round(diff * 100) / 100
    maxProfitResponseObj.date = date;
    maxProfitResponseObj.profit = diff;
    return maxProfitResponseObj;
  },
  calculateBusyDays: function(ticker, body) {
    var busyDaysResponseObj = {"avgVolume":"", "allBusyDays":[]};
    var arrayData = body.datatable.data.filter(function (el) {
      return el[0] == ticker;
    });
    var date = '';
    var daysGreaterThanVolume = [];

    var totalVolume = arrayData.reduce(function(sum, pc) {
      return sum + pc[6]
    }, 0);
    var avgVolume = totalVolume / arrayData.length;
    avgVolume = Math.round(avgVolume * 100) / 100;
    var tenPercentMore = (avgVolume/10) + avgVolume;
    for (var i = 0; i < arrayData.length; i++) {
      var volumeObj = {'day':'', 'volume':0};
      if (arrayData[i][6] > tenPercentMore) {
        volumeObj.day = arrayData[i][1];
        volumeObj.volume = arrayData[i][6];
        daysGreaterThanVolume.push(volumeObj);
      }
    }
    busyDaysResponseObj.avgVolume = avgVolume;
    busyDaysResponseObj.allBusyDays = daysGreaterThanVolume;
    return busyDaysResponseObj;
  },
  calculateBiggestLoser: function(body) {
    var responseObj = {'ticker': '', 'numDays': ''};
    let map = {'MSFT':0, 'GOOGL':0, 'COF':0};
    let test = [];
    /*var test2 = body.datatable.data.reduce(function(map, pc) {
      map[pc[0]] = 0;
      if (pc[5] < pc[2]) {
        map[pc[0]] += 1;
      }
      return map;
    }, {});
    console.log(`test2: ${JSON.stringify(test2)}`);*/
    for (var i = 0; i < body.datatable.data.length; i++) {
      if (body.datatable.data[i][5] < body.datatable.data[i][2]) {
        map[body.datatable.data[i][0]] += 1;
      }
    }
    var max = 0;
    var ticker = '';
    for (element in map) {
      if (map[element] > max) {
        max = map[element];
        ticker = element;
      }
    }
    responseObj.ticker = ticker;
    responseObj.numDays = max;
    return responseObj;
  },
  buildRequest: function(api_key, baseUrl, startDate, endDate) {
    var url = baseUrl + '?date.gte=' + startDate + '&date.lte=' + endDate + '&ticker=MSFT,GOOGL,COF' + '&api_key=' + api_key;
    console.log('url: ' + url);
    return url;
  }
}
