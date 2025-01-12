import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components'; // Adicione esta linha

const EditTransaction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.transaction) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  const [value, setValue] = useState(state?.transaction?.value || '');
  const [description, setDescription] = useState(state?.transaction?.description || '');
  const [error, setError] = useState('');

  // Função para salvar as alterações
  const handleSave = async () => {
    try {
      if (!value || !description) {
        setError('Por favor, preencha todos os campos.');
        return;
      }

      await transactionService.update(state.transaction._id, {
        value: Number(value),
        description,
        type: state.transaction.type
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError('Erro ao salvar alterações. Tente novamente.');
    }
  };

  return (
    <Container>
      <h1>Editar Transação</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Valor"
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
      />
      <Button onClick={handleSave}>Salvar</Button>
    </Container>
  );
};

export default EditTransaction;

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #FFFFFF;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #007BFF;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #DC3545;
`;