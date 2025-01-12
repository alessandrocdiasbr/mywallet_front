import React, { useState } from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!name || name.length < 3) {
            setError('Nome deve ter pelo menos 3 caracteres');
            return false;
        }
        if (!email || !email.includes('@')) {
            setError('E-mail inválido');
            return false;
        }
        if (!password || password.length < 6) {
            setError('Senha deve ter pelo menos 6 caracteres');
            return false;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            console.log('Enviando dados:', { name, email, password, confirmPassword });
            await authService.signUp(name, email, password);
            navigate('/login');
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.details) {
                setError(error.response.data.details[0]);
            } else {
                setError(error.message || 'Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Main>
                <h1>MyWallet</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Nome" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        minLength={3}
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder='Senha' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        minLength={6}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder='Confirme a Senha' 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        minLength={6}
                        required 
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Cadastrar'}
                    </button>
                </form>

                <StyledLink to="/login">Já tem uma conta? Entre agora!</StyledLink>
            </Main>
        </Container>
    );
};

export default CreateAccount;

const Container = styled.div`
background-color: #8c11be;
height: 100vh;
width: 100vw;
font-family: Arial, Helvetica, sans-serif;

display:flex;
align-items: center;
justify-content: center;
flex-direction: column;
`

const Main = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
width: 100%;

h1 {
    color: #fff;
    font-size: 32px;
    font-family: "Saira Stencil One", serif;;
}

form{
    display: flex;
    flex-direction: column;
}

input {
    margin-top: 10px;
    width: 326px;
    height: 58px; 
    border-radius: 5px;
    border: none;
    outline:none;
    font-size: 20px;
    padding:5px;
    color: 000;
}

button {
    margin-top: 10px;
    width: 335px;
    height: 58px; 
    border-radius: 5px;
    border: none;
    outline:none;
    font-size: 20px;
    padding:5px;
    color: #fff;
    background-color: #A328D6;
}

`

const StyledLink = styled(Link)`
color: #fff;
font-size: 15px;
text-decoration: none;
margin-top: 30px;
`;

const ErrorMessage = styled.p`
    color: #ff0000;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
    width: 100%;
`;
