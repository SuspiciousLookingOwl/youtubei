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
exports.SearchResult = void 0;
const constants_1 = require("../../constants");
const Continuable_1 = require("../Continuable");
const SearchResultParser_1 = require("./SearchResultParser");
const proto_1 = require("./proto");
/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link SearchResult} is a helper class to manage search result
 *
 * @example
 * ```ts
 * const result = await youtube.search("Keyword");
 *
 * console.log(result.items); // search result from first page
 *
 * let nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from second page
 *
 * nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from third page
 *
 * console.log(result.items); // search result from first, second, and third page.
 * ```
 *
 * @noInheritDoc
 */
class SearchResult extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client }) {
        super({ client });
    }
    /**
     * Initialize data from search
     *
     * @param query Search query
     * @param options Search Options
     *
     * @hidden
     */
    search(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = [];
            this.estimatedResults = 0;
            const bufferParams = proto_1.SearchProto.SearchOptions.encode(proto_1.optionsToProto(options));
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/search`, {
                data: {
                    query,
                    params: Buffer.from(bufferParams).toString("base64"),
                },
            });
            this.estimatedResults = +response.data.estimatedResults;
            if (this.estimatedResults > 0) {
                const { data, continuation } = SearchResultParser_1.SearchResultParser.parseInitialSearchResult(response.data, this.client);
                this.items.push(...data);
                this.continuation = continuation;
            }
            return this;
        });
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/search`, {
                data: { continuation: this.continuation },
            });
            const { data, continuation } = SearchResultParser_1.SearchResultParser.parseContinuationSearchResult(response.data, this.client);
            return {
                items: data,
                continuation,
            };
        });
    }
}
exports.SearchResult = SearchResult;
