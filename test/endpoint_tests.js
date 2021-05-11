const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const uuid = require('uuid');
const chance = require('chance').Chance();
let app = require('../app/index');

chai.use(chaiHttp);

describe("API endpoint spec tests", async function () {
    this.timeout(0);

    before(async function () {
        server = await chai.request(app).keepOpen();
        test_res = [];
    });

    it('List products spec test', async function () {
        res = await server
            .get('/api/product');
        expect(res).to.have.status(200);
        expect(res.body.code).equals('Done');
        expect(res.body.content).to.have.property('bundle').that.has.length.at.least(1);
    });

    it('Get product spec test', async function () {
        // usually done in before but I hardcode it there
        let id = 'e8fa3d82-457f-485d-9652-a192de550268';
        res = await server
            .get('/api/product/e8fa3d82-457f-485d-9652-a192de550268');
        expect(res).to.have.status(200);
        expect(res.body.code).equals('Done');
        expect(res.body.content.id).to.be.equal(id);
    });

    it('Add new product spec test', async function () {
        let res = await server
            .post('/api/product')
            .send({
                name: chance.string({ alpha: true, length: 10 }),
                price: 0.0,
                quantity: 1
            });
        expect(res).to.have.status(201);
        expect(res.body.code).equals('Enqueued');
        expect(res.body.content.id).to.not.be.null;

        test_res.push(res.body.content.id);
    });

    it('Update new spec products', async function () {
        // create product
        let res = await server
            .post(`/api/product`)
            .send({
                name: chance.string({ alpha: true, length: 10 }),
                price: 0.0,
                quantity: 1
            });
        expect(res).to.have.status(201);
        expect(res.body.code).equals('Enqueued');
        expect(res.body.content.id).to.not.be.null;

        // update product
        let product_id = res.body.content.id;
        res = await server
            .put(`/api/product/${product_id}`)
            .send({
                id: product_id,
                name: res.body.content.name,
                price: 10.0,
                quantity: 100
            });
        expect(res).to.have.status(200);
        expect(res.body.code).equals('Enqueued');
        expect(res.body.content.id).equals(product_id);

        test_res.push(res.body.content.id);
    });

    it('Remove products spec test', async function () {
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
        expect(res.body.code).equals('Enqueued');
        // remove
        res = await server
            .delete(`/api/product/${product_id}`);
        expect(res).to.have.status(204);
    });

    after(async function () {
        // iterate until it passes
        for (let id of test_res) {
            let res = await server.delete(`/api/product/${id}`);
            while (res.status != 204) {
                res = await server.delete(`/api/product/${id}`);
            }
        }
        await server.close();
    })
});
