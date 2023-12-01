import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './lib/react-query/queryProvider';
const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
    <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryProvider>
    </BrowserRouter >
)