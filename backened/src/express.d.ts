import { IUser } from "./Types/Model.Types.ts"
import "express-serve-static-core";


declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}