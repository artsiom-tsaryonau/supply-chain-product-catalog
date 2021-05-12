const { supplyChain } = require('../config.json');
const superagent = require('superagent');
const { queue } = require('./processor');
const uuid = require('uuid');

// GET requests go by QUERY route
function listProducts(req, res) {
    superagent.get(supplyChain, (err, sp) => {
        if (err) {
            res.status(500).json({ code: 'Error', message: 'Failed to process request. Try again later.' });
        } else {
            res.status(200).json({ code: 'Done', content: sp.body });
        }
    });
}

function getProduct(req, res) {
    superagent.get(`${supplyChain}/${req.params.id}`, (err, sp) => {
        if (err) {
            if (err.response.status == 404) {
                res.status(404).json({ code: 'Done', message: 'Resource not found' });
            } else {
                res.status(500).json({ code: 'Error', message: 'Failed to process request. Try again later.' });
            }
        } else {
            res.status(200).json({ code: 'Done', content: sp.body });
        }
    });
}

// POST, PUT, DELETE requests go by COMMAND route
function deleteProduct(req, res) {
    queue.push({ 'type': 'DELETE', 'endpoint': `${supplyChain}/${req.params.id}` });
    res.status(204).send();
}

function addProduct(req, res) {
    req.body.id = uuid.v4();

    queue.push({ 'type': 'POST', 'endpoint': supplyChain, 'payload': req.body });
    res.status(201).json({ code: 'Enqueued', content: req.body });
}

function updateProduct(req, res) {
    queue.push({ 'type': 'PUT', 'endpoint': supplyChain, 'payload': req.body });
    res.status(200).json({ code: 'Enqueued', content: req.body });
}

module.exports = { listProducts, getProduct, deleteProduct, addProduct, updateProduct };