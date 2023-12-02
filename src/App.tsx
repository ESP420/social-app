import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"
import AuthLayout from './auth/AuthLayout';
import RootLayout from './router/RootLayout';

import SignInForm from './auth/forms/SignInForm';
import SignUpForm from './auth/forms/SignUpForm';
import { Home } from './router/pages';

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
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}

export default app;
