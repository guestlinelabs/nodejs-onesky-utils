function rootRequire(name) {
  return require(`${__dirname}/../${name}`);
}

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
let requestPromise;
let oneskyUtils;
let defaultOptions;

const originalFetch = globalThis.fetch;

chai.use(sinonChai);
describe("POST translations with wrong credentials", () => {
  before(() => {
    globalThis.fetch = async () => {
      try {
        await requestPromise;
        return {
          json: () => requestPromise,
        };
      } catch {
        let errValue;
        await requestPromise.catch((err) => {
          errValue = err;
        });
        throw {
          json: async () => JSON.parse(errValue),
        };
      }
    };

    oneskyUtils = rootRequire("index.js");
  });

  after(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    defaultOptions = {
      language: "pl",
      projectId: "projectId",
      secret: "secret",
      apiKey: "apiKey",
      format: "HIERARCHICAL_JSON",
      fileName: "app-translation.json",
      content: JSON.stringify({ toTranslate: "Hey there" }),
      keepStrings: false,
    };
  });

  it("Return error request fails with 400", () => {
    requestPromise = new Promise((resolve, reject) => {
      reject('{ "message": "Unable to upload document", "code": 400 }');
    });

    oneskyUtils
      .postFile(defaultOptions)
      .then((data) => {
        expect(data).to.be.undefined;
      })
      .catch((error) => {
        expect(error.code).to.equal(400);
        expect(error.message).to.equal("Unable to upload document");
      });
  });

  it("Return success on valid content", (done) => {
    const successCallback = sinon.spy();
    const errorCallback = sinon.spy();

    requestPromise = new Promise((resolve, reject) => {
      resolve('{"meta":{"status":201},"data":{}}');
    });

    oneskyUtils
      .postFile(defaultOptions)
      .then(successCallback, errorCallback)
      .then(() => {
        expect(errorCallback).to.not.have.been.calledOnce;
        expect(successCallback).to.have.been.calledOnce;
      })
      .then(done)
      .catch(done);
  });
});
