import { Types, Document } from "mongoose";


interface IrofileImage {
  url: string,
  publicId: string;
}
export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  password: string;

  followers: Types.ObjectId[];
  following: Types.ObjectId[];

  profileImage: IrofileImage;
  coverImage?: IrofileImage 
  bio: string;
  link: string;
  refreshToken: string
  isPasswordCorrect(password: string): Promise<boolean>

};
export interface INoti {

  from: Types.ObjectId
  to: Types.ObjectId

  type: string;
  read: Boolean;

}