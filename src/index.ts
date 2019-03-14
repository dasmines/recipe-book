import * as program from 'commander';
import { argv } from 'process';
import { save } from './recipeStore';

program
	.version('0.0.1')
	.command('save <url> [otherUrls...]')
	.description('Save recipes from the given urls to the recipe book')
	.action(saveUrls)
	.parse(argv);

if (argv.length < 3) {
	program.help();
}

async function saveUrls(url, otherUrls) {
	var urls = [url];
	if (otherUrls) {
		urls = urls.concat(otherUrls);
	}
	await save(urls);
	console.log(`Saved ${urls.toString()}`)
}