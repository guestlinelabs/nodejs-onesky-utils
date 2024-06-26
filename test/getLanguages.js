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
describe("GET languages list with wrong credentials", () => {
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
			.getLanguages(defaultOptions)
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
			resolve({
				response: {
					body: JSON.stringify({
						meta: {
							status: 200,
							record_count: 2,
						},
						data: [
							{
								code: "en-US",
								english_name: "English (United States)",
								local_name: "English (United States)",
								locale: "en",
								region: "US",
								is_base_language: true,
								is_ready_to_publish: true,
								translation_progress: "100%",
								uploaded_at: "2013-10-07T15:27:10+0000",
								uploaded_at_timestamp: 1381159630,
							},
							{
								code: "ja-JP",
								english_name: "Japanese",
								local_name: "日本語",
								locale: "ja",
								region: "JP",
								is_base_language: false,
								is_ready_to_publish: true,
								translation_progress: "98%",
								uploaded_at: "2013-10-07T15:27:10+0000",
								uploaded_at_timestamp: 1381159630,
							},
						],
					}),
				},
			});
		});

		oneskyUtils
			.getLanguages(defaultOptions)
			.then(successCallback, errorCallback)
			.then(() => {
				expect(errorCallback).to.not.have.been.calledOnce;
				expect(successCallback).to.have.been.calledOnce;
			})
			.then(done)
			.catch(done);
	});
});
