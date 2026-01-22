export type User = {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;

};

export type Comment = {
  _id: string;
  text: string;
  user: User;
};

export type PostType = {
  _id: string;
  text: string;
  postimg?: string;
  user: User;
  likes: string[]; // userIds
  comments: Comment[];
  createdAt: string;
  url?:string
  
};
