import { readFile } from 'fs';
import isNode from 'detect-node';
import { promisify } from 'util';
import { EventEmitter } from 'events';

export * from './barretenberg_wasm.js';
export * from './worker_pool.js';
export * from './worker_factory.js';
export { BarretenbergWorker } from './worker.js';

EventEmitter.defaultMaxListeners = 30;

export async function fetchCode() {
  if (isNode) {
    return await promisify(readFile)(__dirname + '/barretenberg.wasm');
  } else {
    const res = await fetch('/barretenberg.wasm');
    return Buffer.from(await res.arrayBuffer());
  }
}
