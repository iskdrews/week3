pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

// @dev Coding the Super Mastermind (a.k.a. Deluxe Mastermind; a.k.a. Advanced Mastermind)
//      with 8 colors, and 5 holes. 
template MastermindVariation() {
    // Public inputs
    signal input pubGuessA;
    signal input pubGuessB;
    signal input pubGuessC;
    signal input pubGuessD;
    signal input pubGuessF;
    signal input pubNumBlacks;
    signal input pubNumWhites;
    signal input pubSolnHash;

    // Private inputs: the solution to the puzzle
    signal input privSolnA;
    signal input privSolnB;
    signal input privSolnC;
    signal input privSolnD;
    signal input privSolnF;

    signal input privSalt;

    // Output
    signal output solnHashOut;

    var nb = 0;

    var guess[5] = [pubGuessA, pubGuessB, pubGuessC, pubGuessD, pubGuessF];
    var soln[5] =  [privSolnA, privSolnB, privSolnC, privSolnD, privSolnF];

    // Count black holes
    for (var i = 0; i < 5; i++) {
        if (guess[i] == soln[i]) {
            nb += 1;

            guess[i] = 0;
            soln[i] = 0;
        }
    }

    var nw = 0;

    // Count white holes
    var k = 0;
    var j = 0;
    for (j = 0; j < 5; j++) {
        for (k = 0; k < 5; k++) {
            if (j != k) {
                if (guess[j] == soln[k]) {
                    if (guess[j] > 0) {
                        nw += 1;
                        guess[j] = 0;
                        soln[k] = 0;
                    }
                }
            }
        }
    }

    signal blacks <-- nb;
    signal whites <-- nw;
    
    // Create a constraint around the number of hit
    component equalBlack = IsEqual();
    equalBlack.in[0] <== pubNumBlacks;
    equalBlack.in[1] <== blacks;
    equalBlack.out === 1;
    
    // Create a constraint around the number of blow
    component equalWhite = IsEqual();
    equalWhite.in[0] <== pubNumWhites;
    equalWhite.in[1] <== whites;
    equalWhite.out === 1;

    // Verify the hash of the private solution if matches
    // the public solution hash
    component poseidon = Poseidon(6);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSolnA;
    poseidon.inputs[2] <== privSolnB;
    poseidon.inputs[3] <== privSolnC;
    poseidon.inputs[4] <== privSolnD;
    poseidon.inputs[5] <== privSolnF;

    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;
}

component main {public [
    pubGuessA, 
    pubGuessB, 
    pubGuessC, 
    pubGuessD, 
    pubGuessF, 
    pubNumBlacks, 
    pubNumWhites, 
    pubSolnHash
]} = MastermindVariation();