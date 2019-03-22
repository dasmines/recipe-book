import * as program from 'commander';
import { error } from 'console';
import { argv } from 'process';
import { save } from './recipeStore';

program
	.version('0.0.1')
	.command('save <url> [otherUrls...]')
	.description('Save recipes from the given urls to the recipe book')
	.action(async (url, otherUrls) => {
		try {
			await save([url, ...otherUrls]);
		} catch (err) {
			error(err);
		}
	});
program.parse(argv);

if (argv.length < 3) {
	program.help();
}
