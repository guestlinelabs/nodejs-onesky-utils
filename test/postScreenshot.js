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

chai.use(sinonChai);

const originalFetch = globalThis.fetch;

describe("POST screenshots", () => {
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	beforeEach(() => {
		defaultOptions = {
			projectId: "projectId",
			secret: "secret",
			apiKey: "apiKey",
			name: "name",
			image: "image",
			tags: [
				{
					key: "key",
					x: 1,
					y: 2,
					width: 3,
					height: 4,
					file: "file",
				},
			],
		};
		globalThis.fetch = async (url, request) => {
			// Assert well formed request
			expect(request.method).to.equal("POST");
			expect(request.body.get("secret")).to.be.null;
			expect(request.body.get("api_key")).to.equal("apiKey");
			expect(request.body.get("dev_hash")).to.not.be.undefined;
			expect(request.body.get("timestamp")).to.not.be.undefined;

			const screenshot = JSON.parse(request.body.get("screenshots"))[0];
			expect(request.body.get("screenshots")).to.not.be.undefined;

			expect(screenshot.name).to.equal("name");
			expect(screenshot.image).to.equal("image");
			expect(screenshot.tags[0].key).to.equal("key");
			expect(screenshot.tags[0].x).to.equal(1);
			expect(screenshot.tags[0].y).to.equal(2);
			expect(screenshot.tags[0].width).to.equal(3);
			expect(screenshot.tags[0].height).to.equal(4);
			expect(screenshot.tags[0].file).to.equal("file");

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

	it("Return error request fails with 400", () => {
		requestPromise = new Promise((resolve, reject) => {
			reject('{ "message": "Unable to upload document", "code": 400 }');
		});

		oneskyUtils
			.postScreenshot(defaultOptions)
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
			.postScreenshot(defaultOptions)
			.then(successCallback, errorCallback)
			.then(() => {
				expect(errorCallback).to.not.have.been.calledOnce;
				expect(successCallback).to.have.been.calledOnce;
			})
			.then(done)
			.catch(done);
	});
});
