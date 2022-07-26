"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSolnInput = exports.genSalt = void 0;
//@ts-ignore TS7016
const index_js_1 = require("../snarkjs/index.js");
const crypto = require("crypto");
const genSalt = () => {
    const buf = crypto.randomBytes(30);
    const salt = index_js_1.bigInt.leBuff2int(buf).sub((0, index_js_1.bigInt)(340));
    // 4 * (4^3) + 4 * (4^2) + 4 * (4^1) + 4 * (4^0) = 340
    // Only return values greater than the largest possible solution
    if (salt.lt(340)) {
        return (0, exports.genSalt)();
    }
    return salt;
};
exports.genSalt = genSalt;
const genSolnInput = (soln) => {
    let m = (0, index_js_1.bigInt)(0);
    for (let i = soln.length - 1; i >= 0; i--) {
        m = m.add((0, index_js_1.bigInt)(soln[i] * 4 ** i));
    }
    return m;
};
exports.genSolnInput = genSolnInput;
//# sourceMappingURL=utils.js.map