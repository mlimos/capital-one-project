const request = require('request');

//var propertiesObject = { ticker: 'MSFT', api_key:'s-GMZ_xkw6CrkGYUWs1p'};
var api_key = 's-GMZ_xkw6CrkGYUWs1p';
var baseUrl = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES';
//console.log('url: ' + url);
let url = buildRequest('2017-01-01', '2017-06-30');
var responseTest = {"MSFT": [], "GOOGL": [], "COF": []};
var innerData = {"month":"", "average_open":"", "average_close":""};

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    //console.log('body:', body);
    body = JSON.parse(body);

    var innerMsftObj;
    var innerGooglObj;
    var innerCofObj;
    for (var i = 1; i <= 6; i++) {
      var msftAverages = calculateAverages('MSFT', i, body);
      var googlAverages = calculateAverages('GOOGL', i, body);
      var cofAverages = calculateAverages('COF', i, body);

      var yearMonth = '2017' + '-0' + i
      innerMsftObj = buildInnerObject(yearMonth, msftAverages);
      innerGooglObj = buildInnerObject(yearMonth, googlAverages);
      innerCofObj = buildInnerObject(yearMonth, cofAverages);

      responseTest.MSFT.push(innerMsftObj);
      responseTest.GOOGL.push(innerGooglObj);
      responseTest.COF.push(innerCofObj);
    }
    console.log('response: ' + JSON.stringify(responseTest));
  }
});

function calculateAverages(ticker, month, body) {
  var totalOpen = 0;
  var totalClose = 0;
  var arrayData = body.datatable.data.filter(function (el) {
    var testDate = new Date(el[1]);
    return el[1].split("-")[1] == '0' + month &&
          el[0] == ticker;
  });

  console.log('arraydata: ' + arrayData);

  for (var i = 0; i < arrayData.length; i++) {
    totalOpen += arrayData[i][2];
    totalClose += arrayData[i][5];
  }
  var averageOpen = totalOpen / arrayData.length;
  var averageClose = totalClose / arrayData.length;
  var averages = {"averageOpen": averageOpen, "averageClose":averageClose};
  return averages;
}

function buildInnerObject(month, averages) {
  var test = {"month":"", "average_open":"", "average_close":""};
  test.month = month;
  test.average_open = averages.averageOpen;
  test.average_close = '$' + averages.averageClose;
  return test;
}

function buildRequest(startDate, endDate) {
  var url = baseUrl + '?date.gte=' + startDate + '&date.lte=' + endDate + '&ticker=MSFT,GOOGL,COF' + '&api_key=' + api_key;
  console.log('url: ' + url);
  return url;
}
