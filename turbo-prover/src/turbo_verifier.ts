import { BarretenbergWorker } from './wasm/index.js';
import { SinglePippenger } from './pippenger/index.js';

export class TurboVerifier {
  private worker!: BarretenbergWorker;

  public async computeKey(pippenger: SinglePippenger, g2Data: Uint8Array): Promise<void> {
    this.worker = pippenger.getWorker();
    await this.worker.transferToHeap(g2Data, 0);
    await this.worker.call('standard_example__init_verification_key', pippenger.getPointer(), 0);
  }

  public async verifyProof(proof: Buffer): Promise<boolean> {
    const proofPtr = await this.worker.call('bbmalloc', proof.length);
    await this.worker.transferToHeap(proof, proofPtr);
    const verified = (await this.worker.call('standard_example__verify_proof', proofPtr, proof.length)) ? true : false;
    await this.worker.call('bbfree', proofPtr);
    return verified;
  }
}
