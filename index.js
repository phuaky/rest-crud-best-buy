var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var fs = require('fs');
var methodOverride = require('method-override')

var app = express();

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// configure app to use ejs for templates
app.set('view engine', 'ejs');

// tell our server where our static files live.
var staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Home page.
app.get("/", function(req, res) {
  var products = getProducts();
  res.render('index', {totalProducts: products.length});
});

// CREATE
app.get("/products/new", function(req, res) {
  res.render('product_new');
});

app.post("/products", function(req, res) {
  // generate a new id and create the whole product.
  var id = "ZX0000" + products.length;
  var product = {
    id: id,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  };

  createProduct(product);

  res.redirect('/products/' + product.id);
});

// READ
app.get("/products", function(req, res) {
  var products = getProducts();
  res.render('products_all', {products: products});
});

app.get("/products/:id", function(req, res) {
  var product = getProduct(req.params.id);
  res.render('product_detail', {product: product});
});

// UPDATE (get an HTML page where user fills values in)
app.get("/products/:id/edit", function(req, res) {
  var product = getProduct(req.params.id);
  res.render('product_edit', {product: product});
});

// UPDATE (this route accept info from the HTML form)
app.put("/products/:id", function(req, res) {
  var product = getProduct(req.params.id);
  product.id = req.params.id;
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;

  editProduct(product);

  res.redirect('/products/' + product.id);
});

app.delete("/products/:id", function(req, res) {
  console.log("DELETE", req.params.id);
  deleteProduct(req.params.id);
  res.redirect("/products");
});

console.log("You're listening to the smooth smooth sounds of http://localhost:3000");
app.listen(3000);

function getProducts() {
  // Load the todo list from a file.
  var productsJSON = fs.readFileSync('./products.json');
  products = JSON.parse(productsJSON);
  return products;
}

function getProduct(id) {
  var products = getProducts();

  var product = undefined;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      product = products[i];
    }
  }
  return product;
}

function editProduct(newProductInfo) {
  var products = getProducts();

  // find the product in the original dataset
  var product = undefined;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === newProductInfo.id) {
      // replace the old into with the new info.
      products[i] = newProductInfo;
    }
  }

  // write all the products back to file.
  writeProducts(products);
}

function createProduct(newProduct) {
  var products = getProducts();
  products.push(newProduct);

  writeProducts(products);
}

function deleteProduct(id) {
  console.log("delete", id);
  var products = getProducts();
  products = products.filter(function(product) {
    // only keep products that don't have the id of the
    // product we're deleting.
    return product.id !== id;
  })

  writeProducts(products);
}

// Converts the given products to JSON and saves the list to a permanent file.
function writeProducts(products) {
  var json = JSON.stringify(products);
  fs.writeFileSync('./products.json', json);
}
