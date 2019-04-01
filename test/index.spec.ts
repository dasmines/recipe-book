import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
use(sinonChai);
import { load, noCallThru } from 'proxyquire';
import { stub } from 'sinon';
noCallThru();

describe('index', () => {
	let mocks: any;
	function loadIndex() {
		load('../src/index', {
			'./recipeStore': mocks.recipeStore,
			'commander': mocks.commander,
			'console': mocks.console,
			'process': mocks.process
		});
	}
	beforeEach(() => {
		mocks = {
			commander: {
				action: stub().returnsThis(),
				command: stub().returnsThis(),
				description: stub().returnsThis(),
				help: stub().returnsThis(),
				parse: stub().returnsThis(),
				version: stub().returnsThis()
			},
			console: {
				error: stub()
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
		it('loads CLI help if a command is not provided', () => {
			loadIndex();
			expect(mocks.commander.help).to.have.been.calledWith();

			mocks.process.argv = ['node', 'index.js', 'blah', 'blah'];
			mocks.commander.help.resetHistory();
			loadIndex();
			expect(mocks.commander.help).to.have.callCount(0);
		});
	});
	describe('when running the save command', () => {
		it('passes the arguments to the recipe store', () => {
			const urls = ['test-url-1', 'test-url-2', 'test-url-3'];
			mocks.process.argv = ['node', 'index.js', 'save', ...urls];
			mocks.commander.action = stub()
				.callsArgWith(0, urls[0], urls.slice(1))
				.returnsThis();
			loadIndex();
			expect(mocks.recipeStore.save).to.have.been.calledWith(urls);
		});
		it('logs an error if the recipe store fails', () => {
			const urls = ['test-url-1', 'test-url-2', 'test-url-3'];
			mocks.process.argv = ['node', 'index.js', 'save', ...urls];
			const error = new Error('Messed up!');
			mocks.recipeStore.save = stub().throws(error);
			mocks.commander.action = stub()
				.callsArgWith(0, urls[0], urls.slice(1))
				.returnsThis();
			loadIndex();
			expect(mocks.console.error).to.have.been.calledWith(error);
		});
	});
});
