// log module makes sure that every sentence indents two spaces
// when log sents in iciba, it won't overflow
import { config } from '../util/config'

export default (str: string) => {
	console.group();
	console.log(str);
	console.groupEnd();
	config.availRows--;
};