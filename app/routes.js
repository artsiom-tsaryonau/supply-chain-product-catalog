const { supplyChain } = require('../config.json');

function listProducts(req, res) {
    res.status(200).json({
        bundle: [{
            id: '1',
            name: 'random name',
            price: 0.0,
            quantity: 1
        }]
    });
}

function getProduct(req, res) {
    res.status(200).json({
        id: req.params.id,
        name: 'random name',
        price: 0.0,
        quantity: 1
    });
}

function deleteProduct(req, res) {
    res.status(204);
}

function addProduct(req, res) {
    res.status(201).json(req.body);
}

function updateProduct(req, res) {
    res.status(200).json(req.body);
}

module.exports = { listProducts, getProduct, deleteProduct, addProduct, updateProduct };