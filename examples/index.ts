import FS from 'fs';
import JsonConvert from '../src/JsonConvert';
import Posts from './models/Posts';

const sourceText = FS.readFileSync('./examples/dataset.json', { encoding: 'utf8' });

function timeLogger<T>(fn: () => T): [T, bigint] {
  const startTime = process.hrtime.bigint();
  const result = fn();
  const endTime = process.hrtime.bigint();

  const executionTime = endTime - startTime;

  return [result, executionTime / 1000n];
}

console.clear();

const [deserializedObject, deserializationTime] = timeLogger(() =>
  JsonConvert.deserialize(Posts)(sourceText),
);

console.log(`[${deserializationTime}ns] deserialization:`, deserializedObject);

const [serializedObject, serializationTime] = timeLogger(() =>
  JsonConvert.serialize(deserializedObject),
);

console.log(`[${serializationTime}ns] serialization:`, serializedObject);
