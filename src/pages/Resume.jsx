import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { transactionService } from '../services/api';

const Resume = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalWithdraw: 0,
        balance: 0,
        mostCommonIncome: '',
        mostCommonWithdraw: '',
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await transactionService.getAll();
                setTransactions(data);
                calculateStats(data);
            } catch (error) {
                console.error('Erro ao carregar transações:', error);
            }
        };

        fetchTransactions();
    }, []);

    const calculateStats = (transactions) => {
        const incomes = transactions.filter(t => t.type === 'income');
        const withdraws = transactions.filter(t => t.type === 'withdraw');

        const totalIncome = incomes.reduce((acc, t) => acc + t.value, 0);
        const totalWithdraw = withdraws.reduce((acc, t) => acc + t.value, 0);

        // Encontra a descrição mais comum para entradas e saídas
        const mostCommonIncome = findMostCommonDescription(incomes);
        const mostCommonWithdraw = findMostCommonDescription(withdraws);

        setStats({
            totalIncome,
            totalWithdraw,
            balance: totalIncome - totalWithdraw,
            mostCommonIncome,
            mostCommonWithdraw,
        });
    };

    const findMostCommonDescription = (transactions) => {
        if (transactions.length === 0) return 'Nenhuma transação';

        const counts = transactions.reduce((acc, t) => {
            acc[t.description] = (acc[t.description] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

    return (
        <Container>
            <Main>
                <h1>Resumo Financeiro</h1>
                
                <StatCard>
                    <h2>Total de Entradas</h2>
                    <Value isPositive={true}>R$ {stats.totalIncome.toFixed(2)}</Value>
                </StatCard>

                <StatCard>
                    <h2>Total de Saídas</h2>
                    <Value isPositive={false}>R$ {stats.totalWithdraw.toFixed(2)}</Value>
                </StatCard>

                <StatCard>
                    <h2>Saldo Atual</h2>
                    <Value isPositive={stats.balance >= 0}>
                        R$ {Math.abs(stats.balance).toFixed(2)}
                    </Value>
                </StatCard>

                <StatCard>
                    <h2>Entrada mais frequente</h2>
                    <p>{stats.mostCommonIncome}</p>
                </StatCard>

                <StatCard>
                    <h2>Saída mais frequente</h2>
                    <p>{stats.mostCommonWithdraw}</p>
                </StatCard>
            </Main>
        </Container>
    );
};

export default Resume;

const Container = styled.div`
    background-color: #8c11be;
    min-height: 100vh;
    padding: 20px;
    font-family: Arial, Helvetica, sans-serif;
`;

const Main = styled.div`
    max-width: 600px;
    margin: 0 auto;

    h1 {
        color: #fff;
        text-align: center;
        margin-bottom: 30px;
        font-size: 24px;
    }
`;

const StatCard = styled.div`
    background: #fff;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    h2 {
        color: #666;
        font-size: 16px;
        margin-bottom: 10px;
    }

    p {
        color: #333;
        font-size: 16px;
    }
`;

const Value = styled.p`
    color: ${props => props.isPositive ? '#03ac00' : '#C70000'};
    font-size: 20px !important;
    font-weight: bold;
`;