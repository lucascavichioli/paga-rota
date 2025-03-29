import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Tabs, 
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Tooltip as MUITooltip,  // Renamed to avoid conflict
  Stack
} from '@mui/material';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTransactions } from '../context/TransactionsContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip as ChartTooltip,  // Renamed to avoid conflict
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,  // Use the renamed import
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Reports() {
  const [tabValue, setTabValue] = useState(0);
  const [monthsToShow, setMonthsToShow] = useState(3);
  const { transactions } = useTransactions();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get data for the last X months
  const getMonthlyData = () => {
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthName = format(date, 'MMM', { locale: ptBR });
      
      months.push(monthName);
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      incomeData.push(income);
      expenseData.push(expense);
    }
    
    return { months, incomeData, expenseData };
  };

  // Get category data for pie charts
  const getCategoryData = (type) => {
    const categoryMap = {};
    
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
      });
    
    return {
      labels: Object.keys(categoryMap),
      data: Object.values(categoryMap)
    };
  };

  const { months, incomeData, expenseData } = getMonthlyData();
  const incomeCategories = getCategoryData('income');
  const expenseCategories = getCategoryData('expense');

  // Chart data for monthly comparison
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Receitas',
        data: incomeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: expenseData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for income categories
  const incomePieData = {
    labels: incomeCategories.labels,
    datasets: [
      {
        data: incomeCategories.data,
        backgroundColor: [
          '#4caf50',
          '#8bc34a',
          '#cddc39',
          '#ffeb3b',
          '#ffc107',
          '#ff9800',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for expense categories
  const expensePieData = {
    labels: expenseCategories.labels,
    datasets: [
      {
        data: expenseCategories.data,
        backgroundColor: [
          '#f44336',
          '#e91e63',
          '#9c27b0',
          '#673ab7',
          '#3f51b5',
          '#2196f3',
          '#03a9f4',
          '#00bcd4',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for balance trend
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Saldo',
        data: incomeData.map((income, index) => income - expenseData[index]),
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1
      }
    ]
  };

  // Get all transactions sorted by date (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
        Relatórios
      </Typography>
      
      <Box sx={{ 
        mb: 3,
        pb: { xs: 7, sm: 0 } // Add padding at the bottom on mobile to make room for floating action buttons
      }}>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={monthsToShow}
            label="Período"
            onChange={(e) => setMonthsToShow(e.target.value)}
            size="small"
          >
            <MenuItem value={3}>Últimos 3 meses</MenuItem>
            <MenuItem value={6}>Últimos 6 meses</MenuItem>
            <MenuItem value={12}>Último ano</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        centered 
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Visão Geral" />
      </Tabs>
      
      {tabValue === 0 && (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
                <Typography variant="h6" gutterBottom>
                  Visão Geral
                </Typography>
                <Box sx={{ height: { xs: 250, sm: 300 } }}>
                  <Bar 
                    data={barChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      },
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            boxWidth: 10,
                            font: {
                              size: window.innerWidth < 600 ? 10 : 12
                            }
                          }
                        }
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Update other chart containers similarly */}
          
        </Grid>
      )}
      
      {/* Update other tab content similarly */}
      
    </Box>
  );
}

export default Reports;