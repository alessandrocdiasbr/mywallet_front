import React, { useState } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NewTransaction = () => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!value || !description) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const numericValue = value.replace(',', '.');
    if (isNaN(numericValue) || parseFloat(numericValue) <= 0) {
      setError('Digite um valor válido');
      return;
    }

    try {
      setLoading(true);
      const transactionData = {
        value: parseFloat(numericValue),
        description,
        type: "deposit"
      };

      console.log('Enviando dados:', transactionData);
      await transactionService.create(transactionData);
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      console.error('Detalhes do erro:', error.response?.data);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.details) {
        setError(error.response.data.details[0]);
      } else {
        setError('Erro ao salvar a transação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <TopBar>
        <BackButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </BackButton>
        <Header>Nova entrada</Header>
      </TopBar>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Valor"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={loading}
          required
        />
        <Input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar entrada'}
        </Button>
      </Form>
    </Container>
  );
};

export default NewTransaction;

const Container = styled.div`
  background-color: #8c11be;
  min-height: 100vh;
  padding: 25px;
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
  box-sizing: border-box;
  
  @media (max-height: 600px) {
    padding: 15px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-height: 600px) {
    margin-bottom: 20px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Header = styled.h1`
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  
  @media (max-height: 600px) {
    font-size: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  height: 52px;
  background: #fff;
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 18px;
  color: #000;
  box-sizing: border-box;

  @media (max-height: 600px) {
    height: 45px;
    font-size: 16px;
    padding: 12px;
  }

  &::placeholder {
    color: #000;
    opacity: 0.8;
  }

  &:disabled {
    background-color: #f2f2f2;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 46px;
  background: #a328d6;
  border-radius: 5px;
  border: none;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  margin-top: 5px;

  @media (max-height: 600px) {
    height: 40px;
    font-size: 18px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #9236b9;
  }
`;

const ErrorMessage = styled.div`
  color: #ff3333;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
`;
