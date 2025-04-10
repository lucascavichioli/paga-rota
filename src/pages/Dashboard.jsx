import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Chip,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTransactions } from '../context/TransactionsContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { 
    getDailySummary, 
    getWeeklySummary, 
    getMonthlySummary, 
    calculateBalance,
    deleteTransaction,
    getAllTransactions
  } = useTransactions();

  // Get all transactions for the total balance calculation
  const allTransactions = getAllTransactions();
  const totalBalance = calculateBalance(allTransactions);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTransactions = () => {
    switch (tabValue) {
      case 0:
        return getDailySummary(selectedDate);
      case 1:
        return getWeeklySummary(selectedDate);
      case 2:
        return getMonthlySummary(selectedDate);
      default:
        return [];
    }
  };

  const transactions = getTransactions();
  const balance = calculateBalance(transactions);
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
      },
    ],
  };

  const getPeriodLabel = () => {
    switch (tabValue) {
      case 0:
        return format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      case 1:
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${format(startOfWeek, "dd/MM", { locale: ptBR })} - ${format(endOfWeek, "dd/MM/yyyy", { locale: ptBR })}`;
      case 2:
        return format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
      default:
        return '';
    }
  };

  return (
    <Box>
      {/* Add AppBar with total balance */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Saldo Geral
            </Typography>
            <Typography 
              variant="h6" 
              component="div" 
              color={totalBalance >= 0 ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 'bold' }}
            >
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBalance)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ maxWidth: { sm: '100%', md: '1200px' }, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
          Dashboard
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          // Remove the centered prop since it conflicts with scrollable
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Diário" />
          <Tab label="Semanal" />
          <Tab label="Mensal" />
        </Tabs>
        
        <Typography variant="h6" align="center" gutterBottom>
          {getPeriodLabel()}
        </Typography>
        
        {/* Reorganized summary cards - Balance with emphasis */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 }, width: '100%', mx: 0 }}>
          <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
            <Card sx={{ 
              boxShadow: 3,
              width: '100%',
              background: theme => `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
            }}>
              <CardContent sx={{ py: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Saldo Total
                </Typography>
                <Typography 
                  variant="h3" 
                  component="div" 
                  color={balance >= 0 ? 'success.main' : 'error.main'} 
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 'bold'
                  }}
                >
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ py: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
                    <Typography color="textSecondary" gutterBottom>
                      Receitas
                    </Typography>
                    <Typography variant="h5" component="div" color="success.main"
                      sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ py: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
                    <Typography color="textSecondary" gutterBottom>
                      Despesas
                    </Typography>
                    <Typography variant="h5" component="div" color="error.main"
                      sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ py: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Distribuição
                </Typography>
                <Box sx={{ 
                  height: { xs: 250, sm: 300 }, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  flexGrow: 1
                }}>
                  {income > 0 || expense > 0 ? (
                    <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                  ) : (
                    <Typography color="textSecondary">Sem dados para exibir</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ py: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Transações Recentes
                </Typography>
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {transactions.length > 0 ? (
                    <List>
                      {transactions.slice(0, 5).map((transaction) => (
                        <Box key={transaction.id}>
                          <ListItem>
                            <ListItemText
                              primary={transaction.description}
                              secondary={format(new Date(transaction.date), "dd/MM/yyyy")}
                            />
                            <Chip
                              label={`R$ ${transaction.amount.toFixed(2)}`}
                              color={transaction.type === 'income' ? 'success' : 'error'}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" onClick={() => deleteTransaction(transaction.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider />
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography color="textSecondary" align="center">
                      Nenhuma transação encontrada
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>  // This closing tag was missing
  );
}

export default Dashboard;