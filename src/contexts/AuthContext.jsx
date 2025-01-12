import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { authService } from '../services/api'; 

const AuthContext = createContext({
    user: null,
    signIn: () => {},
    signOut: () => {}
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        const isPublicRoute = location.pathname === '/login' || location.pathname === '/createAccount';

        if (token && userData) {
            api.defaults.headers.Authorization = `Bearer ${token}`;
            setUser(JSON.parse(userData));
        } else if (!isPublicRoute) {
            navigate('/login');
        }
        setLoading(false);
    }, [navigate, location.pathname]);

    const signIn = async (credentials) => {
        try {
            const response = await authService.signIn(credentials.email, credentials.password);
            console.log('Dados do login:', response);
            
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                api.defaults.headers.Authorization = `Bearer ${response.token}`;

                const tokenParts = response.token.split('.');
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('Dados do token:', payload);

                const userInfo = {
                    email: credentials.email,
                    name: localStorage.getItem('userData')?.name || credentials.email.split('@')[0]
                };
                
                console.log('Dados do usuário salvos:', userInfo);
                setUser(userInfo);
                localStorage.setItem('userData', JSON.stringify(userInfo));
                navigate('/');
                return response;
            }
            throw new Error('Dados de login inválidos');
        } catch (error) {
            console.error('Erro no login:', error);
            throw new Error('Email ou senha inválidos');
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        delete api.defaults.headers.Authorization;
        navigate('/login');
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    const contextValue = {
        user,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
