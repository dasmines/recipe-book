import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
use(sinonChai);
import { load, noCallThru } from 'proxyquire';
import { match, stub } from 'sinon';
noCallThru();

describe('recipeStore', () => {
	let mocks: any;
	let recipeStore: { save(urls: string[]): void };
	beforeEach(() => {
		mocks = {
			console: {
				error: stub(),
				log: stub()
			},
			fs: {
				appendFile: stub(),
				readFile: stub().resolves('')
			}
		};
		recipeStore = load('../src/recipeStore', {
			console: mocks.console,
			fs: { promises: mocks.fs }
		});
	});
	describe('when saving recipes', () => {
		it('loads the recipe cache', async () => {
			const filename = match.string;
			const encoding = match.string;
			await recipeStore.save(['test.url']);
			expect(mocks.fs.readFile).to.have.been.calledWith(filename, encoding);
		});
		it('writes the recipe to a file', async () => {
			const filename = match.string;
			const url = 'test.url';
			await recipeStore.save([url]);
			expect(mocks.fs.appendFile).to.have.been.calledWith(filename, match(url));
		});
		it('caches the recipes that have already been saved', async () => {
			const savedUrl = 'test.url';
			mocks.fs.readFile.resolves(savedUrl);
			await recipeStore.save([savedUrl]);
			expect(mocks.fs.appendFile).to.have.callCount(0);
		});
	});
});
