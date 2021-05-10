const config = require('../config.json');
const chai = require('chai');
const { expect, assert } = require('chai');
const chaiHttp = require('chai-http');
const uuid = require('uuid');
const chance = require('chance').Chance();
let app = require('../app/index');

chai.use(chaiHttp);

describe("API endpoint spec tests", async () => {
    // this.timeout(0);

    before(async () => {
        server = chai.request(app).keepOpen();
        testResources = [];
    });

    it('List products spec test', async () => {
        // initial resource just in case if the supply chain is empty
        let product_id = uuid.v4();
        let res = await server
            .post('/api/product')
            .send({
                id: product_id,
                name: chance.string({ alpha: true, length: 10 }),
                price: 0.0,
                quantity: 1
            });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id').that.equals(product_id);
        testResources.push(product_id);

        res = await server
            .get('/api/product');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('bundle').that.has.length.at.least(1);
    });

    it('Add new product spec test', async () => {
        // add product
        let product_id = uuid.v4();
        let res = await server
            .post('/api/product')
            .send({
                id: product_id,
                name: chance.string({ alpha: true, length: 10 }),
                price: 0.0,
                quantity: 1
            });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id').that.equals(product_id);
        testResources.push(product_id);
    });

    it('Update new spec products', async () => {
        // add product
        let product_id = uuid.v4();
        let res = await server
            .post(`/api/product`)
            .send({
                id: product_id,
                name: chance.string({ alpha: true, length: 10 }),
                price: 0.0,
                quantity: 1
            });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id').that.equals(product_id);
        expect(res.body).to.have.property('price').that.equals(0.0);
        
        // update product
        res = await server
            .put(`/api/product/${product_id}`)
            .send({
                id: product_id,
                name: chance.string({ alpha: true, length: 10 }),
                price: 1.0,
                quantity: 1
            });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id').that.equals(product_id);
        expect(res.body).to.have.property('price').that.equals(1.0);
        testResources.push(product_id);
    });

    it('Remove products spec test', async () => {
        // add product
        let product_id = uuid.v4();
        let res = await server
            .post('/api/product')
            .send({
                id: product_id,
                name: chance.string({ alpha: true, length: 10 }),
                price: 0.0,
                quantity: 1
            });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id').that.equals(product_id);
        expect(res.body).to.have.property('price').that.equals(0.0);

        // TODO: fix timeout issue
        // remove added 
        res = await server
            .delete(`/api/product/${product_id}`)
        expect(res).to.have.status(204);

        // check not found
        res = await server
            .get(`/api/product/${product_id}`);
        expect(res).to.have.status(404);
    });

    after(async () => {
        // TODO: fix timeout issues
        for (resource_id of testResources) {
            let res = await server.delete(`/api/product/${resource_id}`);
            expect(res).to.have.status(204);
        }
    });
});
