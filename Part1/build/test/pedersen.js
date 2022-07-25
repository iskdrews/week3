"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinEncodedHashes = exports.encodePedersen = exports.pedersenHashDouble = exports.pedersenHash = void 0;
const index_js_1 = require("../snarkjs/index.js");
const main_js_1 = require("../circomlibjs/main.js");
const main_js_2 = require("../circomlibjs/main.js");
const pedersenHash = (val) => {
    const buff = index_js_1.bigInt.leInt2Buff(val, 32);
    const hashed = main_js_1.buildPedersenHash.hash(buff);
    const hashAsInt = index_js_1.bigInt.leBuff2int(hashed);
    const result = main_js_2.buildBabyjub.unpackPoint(hashed);
    const encodedHash = encodePedersen(result);
    return {
        encodedHash,
        babyJubX: result[0],
        babyJubY: result[1],
    };
};
exports.pedersenHash = pedersenHash;
const pedersenHashDouble = (a, b) => {
    return pedersenHash(joinEncodedHashes(a, b));
};
exports.pedersenHashDouble = pedersenHashDouble;
const joinEncodedHashes = (a, b) => {
    const bufA = index_js_1.bigInt.leInt2Buff(a, 32);
    const bufB = index_js_1.bigInt.leInt2Buff(b, 32);
    const resultBuf = Buffer.alloc(32);
    for (let i = 0; i < 16; i++) {
        resultBuf[i + 16] = bufA[i];
        resultBuf[i] = bufB[i];
    }
    const result = index_js_1.bigInt.leBuff2int(resultBuf);
    return result;
};
exports.joinEncodedHashes = joinEncodedHashes;
const encodePedersen = (unpackedPoint) => {
    const xBuff = index_js_1.bigInt.leInt2Buff(unpackedPoint[0], 32);
    const yBuff = index_js_1.bigInt.leInt2Buff(unpackedPoint[1], 32);
    const result = Buffer.alloc(32);
    result[31] = xBuff[31];
    for (let i = 0; i < 31; i++) {
        result[i] = yBuff[i];
    }
    return index_js_1.bigInt.leBuff2int(result, 32);
};
exports.encodePedersen = encodePedersen;
//# sourceMappingURL=pedersen.js.map