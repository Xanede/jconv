import FS from 'fs';
import JsonConvert from './JsonConvert';
import Games from './models/Games';

const text1 = FS.readFileSync('./dataset.json', { encoding: 'utf8' });

console.clear();
console.log('init');

const jObject1 = JsonConvert.deserialize(Games)(text1);
console.log(jObject1);

const text2 = JsonConvert.serialize(jObject1);
console.log(text2);

const jObject2 = JsonConvert.deserialize(Games)(text2);
console.log(jObject2);
