import protobuf from "protobufjs";
export var TranscriptParamsProto = protobuf.parse("\n\tmessage TranscriptParams {\n\t\toptional string videoId = 1;\n\t}\n").root.lookupType("TranscriptParams");
