

import { INewPost, INewUser } from "../types";
import { account, appwriteConfig, avatars, databases, ID, Query, storage } from "./config";


export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })
        return newUser;
    } catch {
        console.warn
    }
    return user;
}
export async function saveUserToDB(user: { accountId: string, name: string, email: string, username: string, imageUrl: URL }) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser
    } catch {
        console.warn
    }
}
export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailSession(
            user.email,
            user.password
        )
        return session
    } catch {
        console.warn
    }
}
export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current")
        return session
    } catch {
        console.warn
    }
}
// ============================== GET ACCOUNT
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET USER
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}
// ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {

        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;
        //get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error;
        }
        //convert tags into array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                location: post.location,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                tags,
            }
        )
        if (!newPost) {
            deleteFile(uploadedFile.$id)
            throw Error;
        }
        return newPost;
    } catch (error) {
        console.warn(error)
    }
}
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId,
        )
        return { status: 'ok' };
    } catch (error) {
        console.warn(error)
    }
}
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        )
        return fileUrl;
    } catch (error) {
        console.warn(error)
    }
}
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.warn(error)
    }
}
//getRecentPosts
export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId, [Query.orderDesc('$createdAt'), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
}
//likepost whit app write
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            { Likes: likesArray }
        )
        if (!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}
export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if (!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSavedPost(saveRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            saveRecordId,
        )
        if (!statusCode) throw Error;
        return statusCode;
    } catch (error) {
        console.log(error)
    }
}