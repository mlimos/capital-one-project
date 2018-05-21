const express = require('express');
const app = express();
const Home = require('./controllers/Home');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})

app.all('/', function (req, res) {
  Home.getContent(req, res);
});
