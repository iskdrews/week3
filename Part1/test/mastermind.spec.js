//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

describe("Mastermind circuits", () => {
  let circuitDef;
  let circuit;

  beforeEach(async () => {
    const circuitFile =
      __dirname + "/../contracts/circuits/MastermindVariation.circom";
    circuit = await wasm_tester(circuitFile);
    await circuit.loadConstraints();
  });

  it("Mastermind Variation", async () => {
    const testCases = [
      {
        guess: [1, 2, 2, 1, 1],
        soln: [2, 2, 1, 2, 1],
        whitePegs: 2,
        blackPegs: 2,
      },
      {
        guess: [1, 3, 3, 3, 1],
        soln: [3, 3, 3, 3, 1],
        whitePegs: 0,
        blackPegs: 4,
      },
    ];

    testCases.forEach(async (testCase) => {
      const soln = genSolnInput(testCase.soln);
      const saltedSoln = soln.add(genSalt());
      const hashedSoln = pedersenHash(saltedSoln);

      const testInput = {
        pubNumBlacks: testCase.blackPegs.toString(),
        pubNumWhites: testCase.whitePegs.toString(),

        pubSolnHash: hashedSoln.encodedHash.toString(),
        privSaltedSoln: saltedSoln.toString(),

        pubGuessA: testCase.guess[0],
        pubGuessB: testCase.guess[1],
        pubGuessC: testCase.guess[2],
        pubGuessD: testCase.guess[3],
        pubGuessF: testCase.guess[4],
        privSolnA: testCase.soln[0],
        privSolnB: testCase.soln[1],
        privSolnC: testCase.soln[2],
        privSolnD: testCase.soln[3],
        privSolnF: testCase.soln[4],
      };

      const witness = await circuit.calculateWitness(INPUT, true);

      console.log(witness);

      //assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      //assert(Fr.eq(Fr.e(witness[1]), Fr.e(F.toObject(pubSolnHash))));
    });
  });
});
