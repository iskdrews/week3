const { bigInt } = require("../snarkjs/index.js");
const pedersen = require("circomlibjs").buildPedersenHash;
const babyJub = require("circomlibjs").buildBabyjub;

const pedersenHash = (val) => {
  const buff = bigInt.leInt2Buff(val, 32);
  const hashed = pedersen.hash(buff);
  const hashAsInt = bigInt.leBuff2int(hashed);
  const result = babyJub.unpackPoint(hashed);
  const encodedHash = encodePedersen(result);

  return {
    encodedHash,
    babyJubX: result[0],
    babyJubY: result[1],
  };
};

const pedersenHashDouble = (a, b) => {
  return pedersenHash(joinEncodedHashes(a, b));
};

const joinEncodedHashes = (a, b) => {
  const bufA = bigInt.leInt2Buff(a, 32);
  const bufB = bigInt.leInt2Buff(b, 32);
  const resultBuf = Buffer.alloc(32);

  for (let i = 0; i < 16; i++) {
    resultBuf[i + 16] = bufA[i];
    resultBuf[i] = bufB[i];
  }

  const result = bigInt.leBuff2int(resultBuf);

  return result;
};

const encodePedersen = (unpackedPoint) => {
  const xBuff = bigInt.leInt2Buff(unpackedPoint[0], 32);
  const yBuff = bigInt.leInt2Buff(unpackedPoint[1], 32);

  const result = Buffer.alloc(32);

  result[31] = xBuff[31];

  for (let i = 0; i < 31; i++) {
    result[i] = yBuff[i];
  }
  return bigInt.leBuff2int(result, 32);
};

if (require.main === module) {
  const input = bigInt(process.argv[2]);
  const hash = pedersenHash(input).encodedHash.toString();
  console.log(hash);
}

module.exports = {
  pedersenHash,
  pedersenHashDouble,
  encodePedersen,
  joinEncodedHashes,
};
