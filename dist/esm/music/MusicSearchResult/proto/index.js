import protobuf from "protobufjs";
// TODO move this to .proto file
export var MusicSearchProto = protobuf
    .parse("\n\tmessage MusicSearchOptions {\n\t\tmessage Options {\n\t\t\toptional int32 song = 1;\n\t\t\toptional int32 video = 2;\n\t\t}\n\n\t\tmessage Params {\n\t\t\toptional Options options = 17;\n\t\t}\n\n\t\toptional Params params = 2;\n\t}\n")
    .root.lookupType("MusicSearchOptions");
export var optionsToProto = function (type) {
    return {
        params: {
            options: {
                song: type === "song" ? 1 : undefined,
                video: type === "video" ? 1 : undefined,
            },
        },
    };
};
