var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var fs = require('fs');

var app = express();

// configure app to use ejs for templates
app.set('view engine', 'ejs');

// tell our server where our static files live.
var staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Load the todo list from a file.
var productsJSON = fs.readFileSync('./products.json');
products = JSON.parse(productsJSON);

app.get("/", function(req, res) {
  res.render('index', {totalProducts: products.length});
});

app.get("/products", function(req, res) {
  res.render('products_all', {products: products});
});

app.get("/products/new", function(req, res) {
  res.render('product_new');
});

app.get("/products/:name", function(req, res) {
  var product = products[0];
  res.render('product_detail', {product: product});
});

app.get("/products/:name/edit", function(req, res) {
  var product = products[0];
  res.render('product_edit', {product: product});
});

// All AJAX API routes

console.log("You're listening to the smooth smooth sounds of http://localhost:3000");
app.listen(3000);
