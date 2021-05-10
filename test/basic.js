const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
let app = require('../app/index');

chai.use(chaiHttp);

describe("Basic server test", async () => {
    before(async () => server = chai.request(app));

    it('Test server is running', async () => {
        let res = await server.get(`/`);
        expect(res).to.have.status(200);
    });

    after(async () => server.close());
});