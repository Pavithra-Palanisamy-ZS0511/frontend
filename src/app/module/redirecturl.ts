export interface Redirecturl {    
    token: string;
    lookupId: number;
    isNewUser: boolean;
    expirationTime: string;
}
export interface IEmail{
    userEmail: string;
}
export interface MagicLinkResponseDto{
    status: boolean;
    message: string;
    redirectUrl: string;
}
