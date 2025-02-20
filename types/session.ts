export type UserSession = {
    username?: string;
    role?: string;
};

declare module "iron-session" {
    interface IronSessionData {
        user?: UserSession;
    }
}
