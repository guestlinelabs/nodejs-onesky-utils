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
describe("GET files", () => {
	before(() => {
		globalThis.fetch = async () => {
			try {
				await requestPromise;
				return {
					text: () => requestPromise,
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
			projectId: "projectId",
			secret: "secret",
			apiKey: "apiKey",
		};
	});

	it("Return error when request fails", () => {
		requestPromise = new Promise((resolve, reject) => {
			reject(
				'{"meta":{"status":400,"message":"Invalid source file"},"data":{}}',
			);
		});

		oneskyUtils
			.getFiles(defaultOptions)
			.then((data) => {
				expect(data).to.be.undefined;
			})
			.catch((error) => {
				expect(error.code).to.equal(400);
				expect(error.message).to.equal("Invalid source file");
			});
	});

	it("Return success on valid content", (done) => {
		const successCallback = sinon.spy();
		const errorCallback = sinon.spy();

		requestPromise = new Promise((resolve, reject) => {
			resolve('msgid "test"\nmsgstr "test_content"');
		});

		oneskyUtils
			.getFiles(defaultOptions)
			.then(successCallback, errorCallback)
			.then(() => {
				expect(errorCallback).to.not.have.been.calledOnce;
				expect(successCallback).to.have.been.calledWith(
					'msgid "test"\nmsgstr "test_content"',
				);
			})
			.then(done)
			.catch(done);
	});
});
