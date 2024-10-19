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
export declare class OAuth {
    private static CLIENT_ID;
    private static CLIENT_SECRET;
    private static SCOPE;
    static authorize(): Promise<AuthenticateResponse>;
    private static authenticate;
    static refreshToken(refreshToken: string): Promise<RefreshResponse>;
}
