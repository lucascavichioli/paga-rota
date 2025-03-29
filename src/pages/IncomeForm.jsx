import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Grid,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useTransactions } from '../context/TransactionsContext';

const categories = [
  'Salário',
  'Freelance',
  'Vendas',
  'Investimentos',
  'Presentes',
  'Outros'
];

function IncomeForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!amount) newErrors.amount = 'Valor é obrigatório';
    if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = 'Valor deve ser um número positivo';
    if (!category) newErrors.category = 'Categoria é obrigatória';
    if (!date) newErrors.date = 'Data é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    addTransaction({
      type: 'income',
      description,
      amount: Number(amount),
      category,
      date: date.toISOString(),
      notes,
      createdAt: new Date().toISOString()
    });
    
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Nova Receita
      </Typography>
      
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Valor"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Categoria"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  error={!!errors.category}
                  helperText={errors.category}
                  required
                >
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <DatePicker
                  label="Data"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.date,
                      helperText: errors.date
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="success"
                  >
                    Salvar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default IncomeForm;