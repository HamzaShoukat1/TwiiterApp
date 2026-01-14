
export type MulterFile = {
    profileImage:Express.Multer.File[],
    coverImage:Express.Multer.File[]
}

export type TokenPayload = {
    _id:string
}