import { Prover } from './client_proofs/index.js';

export class TurboProver {
  constructor(private prover: Prover) {}

  // We do not pass in a constraintSystem to this method
  // so that users cannot call it twice and possibly be
  // in a state where they have a different circuit definition to
  // the proving key
  //
  //Ideally, we want this to be called in the constructor and not be manually called by users. Possibly create a .new method
  public async initCircuitDefinition(constraintSystem: Uint8Array): Promise<void> {
    const worker = this.prover.getWorker();
    const constraintSystemPtr = await worker.call('bbmalloc', constraintSystem.length);
    await worker.transferToHeap(constraintSystem, constraintSystemPtr);

    await worker.call('standard_example__init_circuit_def', constraintSystemPtr);
  }

  public async computeKey(): Promise<void> {
    const worker = this.prover.getWorker();
    await worker.call('standard_example__init_proving_key');
  }

  public async createProof(witnessArr: Uint8Array): Promise<Uint8Array> {
    const worker = this.prover.getWorker();

    const witnessPtr = await worker.call('bbmalloc', witnessArr.length);
    await worker.transferToHeap(witnessArr, witnessPtr);

    const proverPtr = await worker.call('standard_example__new_prover', witnessPtr);
    const proof = await this.prover.createProof(proverPtr);
    await worker.call('standard_example__delete_prover', proverPtr);
    return proof;
  }

  public getProver(): Prover {
    return this.prover;
  }
}
