import { Client, MixPlaylist } from "../src";

import "jest-extended";
const youtube = new Client();

describe("MixPlaylist", () => {
    let playlist: MixPlaylist;
    let invalidPlaylist: undefined;

    beforeAll(async () => {
        playlist = (await youtube.getPlaylist("RDjchDYHSBl_c")) as MixPlaylist;
        invalidPlaylist = (await youtube.getPlaylist("foo")) as undefined;
    });

    it("match getPlaylist result", () => {
        expect(playlist.id).toBe("RDjchDYHSBl_c");
        expect(playlist.title).toBe("Mix - ElGrandeToto - Love Nwantiti (ft Ckay) (s l o w e d + r e v e r b)");
        expect(playlist.videoCount).toBeGreaterThan(20);
        expect(playlist.videos.length).toBe(25);
    });

    it("match invalid getPlaylist", async () => {
        expect(invalidPlaylist).toBeUndefined();
    });

});
