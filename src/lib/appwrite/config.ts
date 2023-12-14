import { Client, Account, Databases, Avatars, Storage } from "appwrite";
export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    saveCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
}
const client = new Client();


client
    .setEndpoint(appwriteConfig.url) // Your API Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID

export const account = new Account(client);
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)

export { ID, Query, Permission, Role } from 'appwrite';
