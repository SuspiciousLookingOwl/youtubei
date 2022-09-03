var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import proto from "protocol-buffers";
// TODO move this to .proto file
export var SearchProto = proto("\n\tmessage SearchOptions {\n\t\tmessage Options {\n\t\t\toptional int32 uploadDate = 1;\n\t\t\toptional int32 type = 2;\n\t\t\toptional int32 duration = 3;\n\t\t\toptional int32 hd = 4;\n\t\t\toptional int32 subtitles = 5;\n\t\t\toptional int32 creativeCommons = 6;\n\t\t\toptional int32 live = 8;\n\t\t\toptional int32 4k = 14;\n\t\t\toptional int32 360 = 15;\n\t\t\toptional int32 location = 23;\n\t\t\toptional int32 hdr = 25;\n\t\t\toptional int32 vr180 = 26;\n\t\t}\n\n\t\toptional int32 sortBy = 1;\n\t\toptional Options options = 2;\n\t}\n");
var searchUploadDateProto = {
    all: 0,
    hour: 1,
    today: 2,
    week: 3,
    month: 4,
    year: 5,
};
var searchTypeProto = {
    all: 0,
    video: 1,
    channel: 2,
    playlist: 3,
};
var searchDurationProto = {
    all: 0,
    short: 1,
    long: 2,
    medium: 3,
};
var searchSortProto = {
    relevance: 0,
    rating: 1,
    date: 2,
    view: 3,
};
export var optionsToProto = function (options) {
    var _a;
    var featuresRecord = ((_a = options.features) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, val) {
        if (val)
            acc[val] = 1;
        return acc;
    }, {})) || {};
    return {
        sortBy: options.sortBy && searchSortProto[options.sortBy],
        options: __assign({ duration: options.duration && searchDurationProto[options.duration], type: options.type && searchTypeProto[options.type], uploadDate: options.uploadDate && searchUploadDateProto[options.uploadDate] }, featuresRecord),
    };
};
