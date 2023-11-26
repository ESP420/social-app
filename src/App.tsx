import { Routes, Route } from 'react-router-dom';
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
                    <Route path="/sing-in" element={<SignInForm />} />
                    <Route path="/sing-un" element={<SignUpForm />} />
                </Route>
                {/* private routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </main>
    )
}

export default app;
