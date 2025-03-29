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
import { NumericFormat } from 'react-number-format';
import { useTransactions } from '../context/TransactionsContext';

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Outros'
];

function ExpenseForm() {
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
      type: 'expense',
      description,
      amount: Number(amount.replace(/\D/g, '')) / 100, // Convert from cents to real value
      category,
      date: date.toISOString(),
      notes,
      createdAt: new Date().toISOString()
    });
    
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
        Nova Despesa
      </Typography>
      
      <Card>
        <CardContent sx={{ py: { xs: 2, sm: 3 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                  size="small" // Smaller on mobile
                  sx={{ '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <NumericFormat
                  customInput={TextField}
                  label="Valor"
                  fullWidth
                  value={amount}
                  onValueChange={(values) => {
                    setAmount(values.value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  error={!!errors.amount}
                  helperText={errors.amount}
                  required
                  size="small"
                  sx={{ '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  label="Categoria"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  error={!!errors.category}
                  helperText={errors.category}
                  required
                  size="small"
                  sx={{ '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
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
                      size: "small",
                      required: true,
                      error: !!errors.date,
                      helperText: errors.date,
                      sx: { '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }
                    }
                  }}
                />
              </Grid>
              
              {/* Update other form fields similarly */}
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  mt: { xs: 1, sm: 0 }
                }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                    fullWidth={window.innerWidth < 600} // Full width on mobile
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    fullWidth={window.innerWidth < 600} // Full width on mobile
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

export default ExpenseForm;