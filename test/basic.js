const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
let app = require('../app/index');

chai.use(chaiHttp);

describe("Basic server test", async () => {
    it('Test server is running', async () => {
        let res = await chai.request(app).get(`/`);
        expect(res).to.have.status(200);
    });
});