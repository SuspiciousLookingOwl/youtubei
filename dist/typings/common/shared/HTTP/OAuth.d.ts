export interface AuthorizeResponse {
    deviceCode: string;
    userCode: string;
    expiresIn: number;
    interval: number;
    verificationUrl: string;
}
export interface RefreshResponse {
    accessToken: string;
    expiresIn: number;
    scope: string;
    tokenType: string;
}
export interface AuthenticateResponse {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    scope: string;
    tokenType: string;
}
/** OAuth Helper Class */
export declare class OAuth {
    private static CLIENT_ID;
    private static CLIENT_SECRET;
    private static SCOPE;
    /**
     * Start the authorization process
     *
     * @param manual If true, returns the raw response instead of printing out the code and automatically do a authentication pooling
     */
    static authorize(): Promise<AuthenticateResponse>;
    static authorize(manual: true): Promise<AuthorizeResponse>;
    /**
     * Authenticate to obtain a token and refresh token using the code from the authorize method
     *
     * @param code code obtained from the authorize method
     */
    static authenticate(code: string): Promise<AuthenticateResponse>;
    static refreshToken(refreshToken: string): Promise<RefreshResponse>;
}
