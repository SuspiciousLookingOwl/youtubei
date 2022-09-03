var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
export var getDuration = function (s) {
    s = s.replace(/:/g, ".");
    var spl = s.split(".");
    if (spl.length === 0)
        return +spl;
    else {
        var sumStr = spl.pop();
        var sum = +sumStr;
        if (spl.length === 1)
            sum += +spl[0] * 60;
        if (spl.length === 2) {
            sum += +spl[1] * 60;
            sum += +spl[0] * 3600;
        }
        return sum;
    }
};
export var stripToInt = function (string) {
    if (!string)
        return null;
    return +string.replace(/[^0-9]/g, "");
};
export var getContinuationFromItems = function (items, accessors) {
    var e_1, _a;
    if (accessors === void 0) { accessors = ["continuationEndpoint"]; }
    var continuation = items[items.length - 1];
    var renderer = continuation === null || continuation === void 0 ? void 0 : continuation.continuationItemRenderer;
    if (!renderer)
        return;
    var current = renderer;
    try {
        for (var accessors_1 = __values(accessors), accessors_1_1 = accessors_1.next(); !accessors_1_1.done; accessors_1_1 = accessors_1.next()) {
            var accessor = accessors_1_1.value;
            current = current[accessor];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (accessors_1_1 && !accessors_1_1.done && (_a = accessors_1.return)) _a.call(accessors_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return current.continuationCommand.token;
};
export var mapFilter = function (items, key) {
    return items
        .filter(function (item) { return item[key]; })
        .map(function (item) { return item[key]; });
};
