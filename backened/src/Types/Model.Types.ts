import { Types, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  password: string;

  followers: Types.ObjectId[];
  following: Types.ObjectId[];

  profileImage: string;
  coverImage?: string ,
  bio: string;
  link: string;
  refreshToken:string
    isPasswordCorrect(password:string): Promise<boolean>

}