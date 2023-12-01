export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};
export type INavLink = {
    imgURL: string | string;
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
    imageUrl: URL | string;
    file: File[];
    location?: string;
    tags?: string;
}
export type IUser = {
    id?: string,
    name: string;
    email: string;
    username: string;
    imageUrl: URL | string;
    bio?: string;
}
export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
}