"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendsBuiltIn = void 0;
function extendsBuiltIn() {
    return (target) => {
        return class extends target {
            constructor(...args) {
                super(args);
                Object.setPrototypeOf(this, target.prototype);
            }
        };
    };
}
exports.extendsBuiltIn = extendsBuiltIn;
