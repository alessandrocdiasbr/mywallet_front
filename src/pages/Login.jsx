import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            await signIn({ email, password });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        disabled={loading}
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        disabled={loading}
                        required
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <StyledLink to="/createAccount">
                    Ainda não tem uma conta? Crie uma aqui!
                </StyledLink>
            </Main>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    background-color: #8c11be;
    height: 100vh;
    width: 100vw;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Main = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;

    h1 {
        color: #fff;
        font-size: 32px;
        font-family: "Saira Stencil One", serif;
        margin-bottom: 24px;
    }

    form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 326px;
    }

    input {
        margin-bottom: 13px;
        height: 58px;
        border-radius: 5px;
        border: none;
        outline: none;
        font-size: 20px;
        padding: 15px;
        color: #000;

        &:disabled {
            background-color: #f2f2f2;
            cursor: not-allowed;
        }
    }

    button {
        height: 46px;
        border-radius: 5px;
        border: none;
        outline: none;
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        background-color: #A328D6;
        cursor: pointer;
        margin-top: 8px;

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            background-color: #9236b9;
        }
    }
`;

const StyledLink = styled(Link)`
    color: #fff;
    font-size: 15px;
    text-decoration: none;
    margin-top: 32px;
    text-align: center;

    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.p`
    color: #ff0000;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
    margin-bottom: 10px;
`;
