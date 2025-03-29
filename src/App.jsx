import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './pages/ExpenseForm';
import IncomeForm from './pages/IncomeForm';
import Reports from './pages/Reports';

// Context
import { TransactionsProvider } from './context/TransactionsContext';

// Note: Removed unused useState import

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <TransactionsProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expense" element={<ExpenseForm />} />
                <Route path="/income" element={<IncomeForm />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Layout>
          </Router>
        </TransactionsProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
