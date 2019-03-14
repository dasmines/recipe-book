import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
use(sinonChai);
import { stub, match } from 'sinon';
import { load, noCallThru } from 'proxyquire';
noCallThru();

describe('index', () => {
	let mocks;
	function loadIndex() {
		load('../src/index', {
			'commander': mocks.commander,
			'process': mocks.process,
			'./recipeStore': mocks.recipeStore
		});
	}
	beforeEach(() => {
		mocks = {
			commander: {
				version: stub().returnsThis(),
				command: stub().returnsThis(),
				description: stub().returnsThis(),
				action: stub().returnsThis(),
				parse: stub().returnsThis(),
				help: stub().returnsThis()
			},
			process: {
				argv: ['node', 'index.js']
			},
			recipeStore: {
				save: stub()
			}
		};
	});
	describe('when running without a command', () => {
		it('loads CLI help', () => {
			loadIndex();
			expect(mocks.commander.help).to.have.been.called;
		});
	});
	describe('when running the save command', () => {
		it('passes the arguments to the recipe store', () => {
			const urls = ['test-url-1', 'test-url-2', 'test-url-3'];
			mocks.process.argv = ['node', 'index.js', 'save', ...urls];
			mocks.commander.action = stub().callsArgWith(0, urls[0], urls.slice(1)).returnsThis();
			loadIndex();
			expect(mocks.recipeStore.save).to.have.been.calledWith(urls);
		});
	});
});