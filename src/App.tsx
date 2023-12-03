import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"
import AuthLayout from './auth/AuthLayout';
import RootLayout from './router/RootLayout';

import SignInForm from './auth/forms/SignInForm';
import SignUpForm from './auth/forms/SignUpForm';
import {
    Explore, Home, Profile, Saved, AllUsers, CreatePost,
    EditPost,
    PostDetails,
    UpdateProfile
} from './router/pages';

const app = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                {/* public routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SignInForm />} />
                    <Route path="/sign-up" element={<SignUpForm />} />
                </Route>
                {/* private routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/all-users" element={<AllUsers />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:id" element={<EditPost />} />
                    <Route path="/post/:id/" element={<PostDetails />} />
                    <Route path="/profile/:id/*" element={<Profile />} />
                    <Route path="/update-profile/:id/*" element={<UpdateProfile />} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}

export default app;
