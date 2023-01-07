"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continuable = void 0;
const Base_1 = require("../Base");
/** Represents a continuable list of items `T` (like pagination) */
class Continuable extends Base_1.Base {
    /** @hidden */
    constructor({ client, strictContinuationCheck }) {
        super(client);
        this.items = [];
        this.strictContinuationCheck = !!strictContinuationCheck;
        if (this.strictContinuationCheck)
            this.continuation = null;
    }
    /** Fetch next items using continuation token */
    next(count = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItems = [];
            for (let i = 0; i < count || count == 0; i++) {
                if (!this.hasContinuation)
                    break;
                const { items, continuation } = yield this.fetch();
                this.continuation = continuation;
                newItems.push(...items);
            }
            this.items.push(...newItems);
            return newItems;
        });
    }
    get hasContinuation() {
        return this.strictContinuationCheck ? this.continuation !== undefined : !!this.continuation;
    }
}
exports.Continuable = Continuable;
