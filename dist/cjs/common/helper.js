"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFilter = exports.getContinuationFromItems = exports.stripToInt = exports.getDuration = void 0;
const getDuration = (s) => {
    s = s.replace(/:/g, ".");
    const spl = s.split(".");
    if (spl.length === 0)
        return +spl;
    else {
        const sumStr = spl.pop();
        let sum = +sumStr;
        if (spl.length === 1)
            sum += +spl[0] * 60;
        if (spl.length === 2) {
            sum += +spl[1] * 60;
            sum += +spl[0] * 3600;
        }
        return sum;
    }
};
exports.getDuration = getDuration;
const stripToInt = (string) => {
    if (!string)
        return null;
    return +string.replace(/[^0-9]/g, "");
};
exports.stripToInt = stripToInt;
const getContinuationFromItems = (items, accessors = ["continuationEndpoint"]) => {
    const continuation = items[items.length - 1];
    const renderer = continuation === null || continuation === void 0 ? void 0 : continuation.continuationItemRenderer;
    if (!renderer)
        return;
    let current = renderer;
    for (const accessor of accessors) {
        current = current[accessor];
    }
    return current.continuationCommand.token;
};
exports.getContinuationFromItems = getContinuationFromItems;
const mapFilter = (items, key) => {
    return items
        .filter((item) => item[key])
        .map((item) => item[key]);
};
exports.mapFilter = mapFilter;
