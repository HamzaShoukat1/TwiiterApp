import { IUser } from "./Types/Model.Types.ts"


declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
};