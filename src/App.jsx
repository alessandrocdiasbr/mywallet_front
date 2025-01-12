import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useState } from "react";
import { transactionService } from "./services/api";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import NewTransaction from "./pages/NewTransaction";
import Resume from "./pages/Resume";
import NewWithdraw from "./pages/NewWithdraw";
import EditTransaction from './pages/EditTransaction';

// Componente para rotas protegidas
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

// Componente para rotas públicas
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return !token ? children : <Navigate to="/" />;
};

function App() {
    const [transactions, setTransactions] = useState([]);

    const addTransaction = async (transaction) => {
        try {
            const newTransaction = await transactionService.create(transaction);
            setTransactions(prev => [...prev, newTransaction]);
        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            throw error;
        }
    };

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/createAccount" element={
                        <PublicRoute>
                            <CreateAccount />
                        </PublicRoute>
                    } />
                    
                    {/* Rotas Privadas */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <Home transactions={transactions} addTransaction={addTransaction} />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/newTransaction" element={
                        <PrivateRoute>
                            <NewTransaction addTransaction={addTransaction} />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/newWithdraw" element={
                        <PrivateRoute>
                            <NewWithdraw addTransaction={addTransaction} />
                        </PrivateRoute>
                    } />

                    <Route path="/editTransaction/:id" element={
                        <PrivateRoute>
                            <EditTransaction />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/resume" element={
                        <PrivateRoute>
                            <Resume transactions={transactions} />
                        </PrivateRoute>
                    } />

                    {/* Redireciona qualquer outra rota para login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;