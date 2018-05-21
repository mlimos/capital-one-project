const express = require('express');
const app = express();
const Home = require('./controllers/Home');
const path = require('path');

// Set ejs template
app.set('view engine', 'ejs');
// Get app to use stylesheets in public folder
app.use(express.static(path.join(__dirname, 'public')));
// Set app listening to port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
// Routing for '/'
app.get('/', function (req, res) {
    Home.getContent(req, res);
});
