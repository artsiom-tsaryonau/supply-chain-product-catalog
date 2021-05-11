const express = require('express');
const config = require('../config.json');
const product = require('./routes');

const app = express();
const port = config.server.port;

app.use(express.json());

// basic health check
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.route("/api/product")
    .get(product.listProducts)
    .post(product.addProduct);
app.route("/api/product/:id")
    .get(product.getProduct)
    .delete(product.deleteProduct)
    .put(product.updateProduct);

app.listen(port, () => console.log(`Supply chain app listening on port ${port}!`));

module.exports = app;