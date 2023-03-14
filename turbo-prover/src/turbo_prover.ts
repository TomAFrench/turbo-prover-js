import { Prover } from '@noir-lang/barretenberg/dest/client_proofs/prover';

export class TurboProver {
  constructor(private prover: Prover) {}

  // We do not pass in a constraint_system to this method
  // so that users cannot call it twice and possibly be
  // in a state where they have a different circuit definition to
  // the proving key
  //
  //Ideally, we want this to be called in the constructor and not be manually called by users. Possibly create a .new method
  public async initCircuitDefinition(constraint_system: Uint8Array): Promise<void> {
    let worker = this.prover.getWorker();
    const constraint_system_ptr = await worker.call('bbmalloc', constraint_system.length);
    await worker.transferToHeap(constraint_system, constraint_system_ptr);

    await worker.call('standard_example__init_circuit_def', constraint_system_ptr);
  }

  public async computeKey(): Promise<void> {
    const worker = this.prover.getWorker();
    await worker.call('standard_example__init_proving_key');
  }

  public async createProof(witness_arr: Uint8Array): Promise<Uint8Array> {
    const worker = this.prover.getWorker();

    const witness_ptr = await worker.call('bbmalloc', witness_arr.length);
    await worker.transferToHeap(witness_arr, witness_ptr);

    const proverPtr = await worker.call('standard_example__new_prover', witness_ptr);
    const proof = await this.prover.createProof(proverPtr);
    await worker.call('standard_example__delete_prover', proverPtr);
    return proof;
  }

  public getProver(): Prover {
    return this.prover;
  }
}
