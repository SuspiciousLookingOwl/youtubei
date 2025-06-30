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
    var _a, _b, _c;
    const continuation = items[items.length - 1];
    const renderer = continuation === null || continuation === void 0 ? void 0 : continuation.continuationItemRenderer;
    if (!renderer)
        return;
    let current = renderer;
    for (const accessor of accessors) {
        current = current[accessor];
    }
    if ((_b = (_a = current === null || current === void 0 ? void 0 : current.commandExecutorCommand) === null || _a === void 0 ? void 0 : _a.commands) === null || _b === void 0 ? void 0 : _b.length) {
        current = current.commandExecutorCommand.commands.find((cmd) => "continuationCommand" in cmd);
    }
    return (_c = current === null || current === void 0 ? void 0 : current.continuationCommand) === null || _c === void 0 ? void 0 : _c.token;
};
exports.getContinuationFromItems = getContinuationFromItems;
const mapFilter = (items, key) => {
    return items
        .filter((item) => item[key])
        .map((item) => item[key]);
};
exports.mapFilter = mapFilter;
