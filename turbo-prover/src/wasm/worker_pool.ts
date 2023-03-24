import { createDebugLogger } from '../log/index.js';
import { BarretenbergWasm } from './barretenberg_wasm.js';
import { BarretenbergWorker } from './worker.js';
import { createWorker, destroyWorker } from './worker_factory.js';

const debug = createDebugLogger('bb:worker_pool');

export class WorkerPool {
  public workers: BarretenbergWorker[] = [];

  static async new(barretenberg: BarretenbergWasm, poolSize: number) {
    const pool = new WorkerPool();
    await pool.init(barretenberg.module, poolSize);
    return pool;
  }

  public async init(module: WebAssembly.Module, poolSize: number) {
    debug(`creating ${poolSize} workers...`);
    const start = new Date().getTime();
    this.workers = await Promise.all(
      Array(poolSize)
        .fill(0)
        .map((_, i) => createWorker(`${i}`, module, i === 0 ? 10000 : 256)),
    );
    debug(`created workers: ${new Date().getTime() - start}ms`);
  }

  public async destroy() {
    await Promise.all(this.workers.map(destroyWorker));
  }
}
