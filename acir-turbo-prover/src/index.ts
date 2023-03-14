// TODO: fix this typo of barretenberg spelling
// eslint-disable-next-line camelcase
import { serialise_acir_to_barrtenberg_circuit } from '@noir-lang/aztec_backend';
import {
  TurboProver,
  TurboVerifier,
  setupTurboProverAndVerifier as setupTurboProverAndVerifierFromConstraintSystem,
} from '@noir-lang/turbo-prover';

export { TurboProver, TurboVerifier, createProof, verifyProof } from '@noir-lang/turbo-prover';

/**
 * Takes in an ACIR circuit and returns a prover/verifier for this circuit.
 *
 * @param acir - The serialized ACIR circuit for which we want to prove against.
 * @returns A tuple of a prover and verifier for the passed ACIR.
 */
export function setupTurboProverAndVerifier(acir: Uint8Array): Promise<[TurboProver, TurboVerifier]> {
  const serializedCircuit = serialise_acir_to_barrtenberg_circuit(acir);

  return setupTurboProverAndVerifierFromConstraintSystem(serializedCircuit);
}
