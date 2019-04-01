import { error, log } from 'console';
import { promises } from 'fs';
export { save };

const cache: any = {};
const filename = 'recipes.txt';
const readFile = promises.readFile;
const appendFile = promises.appendFile;

async function loadRecipes() {
	const recipesText = await readFile(filename, 'utf8');
	const recipes = recipesText.split('\n');
	recipes.forEach((recipe) => {
		cache[recipe] = true;
	});
}

async function save(urls: string[]) {
	if (Object.keys(cache).length === 0) {
		await loadRecipes();
	}
	urls.forEach(async (url) => {
		if (!cache[url]) {
			try {
				await appendFile(filename, `${url}\n`);
				cache[url] = true;
			} catch (err) {
				error(err);
			}
		}
	});
	log(`Saved ${urls.toString()}`);
}
