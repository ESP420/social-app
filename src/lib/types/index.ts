export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
}
export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
}
export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
}
export type IUpdatePost = {
    postId: string;
    caption: string
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
}
export type IUser = {
    name: string;
    email: string;
    username: string;
    imageUrl: URL;
    accountId: string;
    bio?: string;
}
export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
}