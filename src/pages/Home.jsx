import React, { useEffect, useState } from 'react';
import { transactionService } from '../services/api';
import styled from "styled-components";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [editMode, setEditMode] = useState(false);

  // Função para pegar as transações
  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
      calculateBalance(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  // Calcula o saldo total
  const calculateBalance = (transactions) => {
    const total = transactions.reduce((acc, transaction) => {
      const value = parseFloat(transaction.value);
      return transaction.type === "deposit"
        ? acc + value
        : acc - value;
    }, 0);
    setBalance(total);
  };

  // Carregar as transações ao montar o componente
  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    signOut();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--/--';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '--/--';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    } catch (error) {
      console.error('Erro ao formatar data:', dateString, error);
      return '--/--';
    }
  };

  const formatValue = (value) => {
    return parseFloat(value).toFixed(2);
  };

  const getUserName = () => {
    console.log('Dados do usuário na Home:', user);
    console.log('Dados do localStorage:', localStorage.getItem('userData'));
    
    if (!user) return 'Usuário';
    return user.name || user.email?.split('@')[0] || 'Usuário';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        console.log('Tentando excluir transação com ID:', id);
        if (!id || typeof id !== 'string' || id.trim() === '') {
          console.error('ID inválido:', id);
          return;
        }

        await transactionService.delete(id);
        setTransactions(transactions.filter(transaction => transaction._id !== id));
        calculateBalance(transactions.filter(transaction => transaction._id !== id));
        setEditMode(false);
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleEdit = (transaction) => {
    navigate('/edit-transaction', { state: { transaction } });
  };

  return (
    <Container>
      <Header>
        <h1>Olá, {getUserName()}</h1>
        <HeaderButtons>
          <EditButton onClick={toggleEditMode}>
            <EditIcon />
          </EditButton>
          <LogoutButton onClick={handleLogout}>
            <LogoutIcon />
          </LogoutButton>
        </HeaderButtons>
      </Header>

      <TransactionsContainer>
        {transactions.length === 0 ? (
          <NoTransactions>
            Não há registros de entrada ou saída
          </NoTransactions>
        ) : (
          <>
            <TransactionsList>
              {transactions.map((transaction) => {
                console.log('Transaction data:', transaction); // Debug log
                console.log('ID da transação:', transaction._id);
                return (
                  <TransactionItem key={transaction._id}>
                    <div className="left">
                      <span className="date">{formatDate(transaction.date)}</span>
                      <span className="description">{transaction.description}</span>
                    </div>
                    <span className={`value ${transaction.type === "deposit" ? 'income' : 'withdraw'}`}>
                      {formatValue(transaction.value)}
                    </span>
                    {editMode && (
                      <>
                        <span className="edit" onClick={() => handleEdit(transaction)}><EditIcon /></span>
                        <span className="delete" onClick={() => handleDelete(transaction._id)}>x</span>
                      </>
                    )}
                  </TransactionItem>
                );
              })}
            </TransactionsList>
            <BalanceContainer>
              <strong>SALDO</strong>
              <Value $isPositive={balance >= 0}>
                {Math.abs(balance).toFixed(2)}
              </Value>
            </BalanceContainer>
          </>
        )}
      </TransactionsContainer>

      <ButtonsContainer>
        <ActionButton onClick={() => navigate('/newTransaction')}>
          <AddCircleOutlineIcon />
          <p>Nova<br />entrada</p>
        </ActionButton>
        <ActionButton onClick={() => navigate('/newWithdraw')}>
          <RemoveCircleOutlineIcon />
          <p>Nova<br />saída</p>
        </ActionButton>
      </ButtonsContainer>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  background-color: #FFFFFF;
  min-height: 100vh;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: Arial, Helvetica, sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  h1 {
    color: #007BFF;
    font-size: 26px;
    font-weight: 700;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #007BFF;
  cursor: pointer;
  padding: 8px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TransactionsContainer = styled.main`
  background-color: #FFFFFF;
  border-radius: 5px;
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TransactionsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  .left {
    display: flex;
    gap: 10px;
  }

  .date {
    color: #c6c6c6;
  }

  .description {
    color: #000;
  }

  .value {
    &.income {
      color: #03ac00;
    }
    &.withdraw {
      color: #c70000;
    }
  }
`;

const NoTransactions = styled.p`
  color: #868686;
  text-align: center;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const BalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  font-size: 17px;
  margin-top: auto;

  strong {
    font-weight: 700;
  }
`;

const Value = styled.span`
  color: ${props => props.$isPositive ? '#03ac00' : '#c70000'};
  font-weight: 700;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  background-color: #007BFF;
  border: none;
  border-radius: 5px;
  color: #FFFFFF;
  cursor: pointer;
  flex: 1;
  padding: 15px;
  height: 114px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  p {
    font-size: 17px;
    font-weight: 700;
    text-align: left;
    line-height: 20px;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #007BFF;
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

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
`;
