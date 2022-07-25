//@ts-ignore TS7016
import { bigInt } from "../snarkjs/index.js";
import * as crypto from "crypto";

export const genSalt = (): bigInt.BigInteger => {
  const buf = crypto.randomBytes(30);
  const salt = bigInt.leBuff2int(buf).sub(bigInt(340));

  // 4 * (4^3) + 4 * (4^2) + 4 * (4^1) + 4 * (4^0) = 340
  // Only return values greater than the largest possible solution
  if (salt.lt(340)) {
    return genSalt();
  }

  return salt;
};

export const genSolnInput = (soln: number[]): bigInt.BigInteger => {
  let m = bigInt(0);

  for (let i = soln.length - 1; i >= 0; i--) {
    m = m.add(bigInt(soln[i] * 4 ** i));
  }

  return m;
};
