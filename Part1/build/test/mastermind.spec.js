"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
// import { Circuit } from "snarkjs";
// import * as compile from 'circom';
const circom_tester_1 = require("circom_tester");
const utils_1 = require("./utils");
const pedersen_1 = require("./pedersen");
describe("Mastermind circuits", () => {
    let circuitDef;
    let circuit;
    beforeEach(async () => {
        const circuitFile = __dirname + "/../contracts/circuits/MastermindVariation.circom";
        circuit = await (0, circom_tester_1.wasm)(circuitFile);
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
        testCases.forEach((testCase) => {
            const soln = (0, utils_1.genSolnInput)(testCase.soln);
            const saltedSoln = soln.add((0, utils_1.genSalt)());
            const hashedSoln = (0, pedersen_1.pedersenHash)(saltedSoln);
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
            const witness = circuit.calculateWitness(testInput);
            console.log("NB calculated by circuit:", witness[circuit.getSignalIdx("main.pubNumBlacks")]);
            expect(witness[circuit.getSignalIdx("main.pubNumBlacks")].toString()).toEqual(testCase.blackPegs.toString());
            console.log("NW calculated by circuit:", witness[circuit.getSignalIdx("main.pubNumWhites")]);
            expect(witness[circuit.getSignalIdx("main.pubNumWhites")].toString()).toEqual(testCase.whitePegs.toString());
            console.log("Hash calculated by circuit:", witness[circuit.getSignalIdx("main.solnHashOut")].toString(16));
            console.log("Hash calculated by JS     :", hashedSoln.encodedHash.toString(16));
            expect(hashedSoln.encodedHash.toString()).toEqual(witness[circuit.getSignalIdx("main.solnHashOut")].toString());
        });
    });
});
//# sourceMappingURL=mastermind.spec.js.map