import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Container,
  Fab,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  AddCircle as AddIcon, 
  RemoveCircle as RemoveIcon, 
  BarChart as ReportIcon,
  Add as PlusIcon
} from '@mui/icons-material';

const drawerWidth = 240;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Nova Receita', icon: <AddIcon />, path: '/income' },
    { text: 'Nova Despesa', icon: <RemoveIcon />, path: '/expense' },
    { text: 'Relatórios', icon: <ReportIcon />, path: '/reports' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          PagaRota
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PagaRota
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, // Responsive padding
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}> {/* Responsive container padding */}
          {children}
        </Container>
        
        {/* Updated FAB section with two buttons of equal size */}
        <Box sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', sm: 'none' },
          gap: 1
        }}>
          <Fab 
            color="success" 
            aria-label="add income"
            size="medium"
            onClick={() => navigate('/income')}
            sx={{ boxShadow: 2 }}
          >
            <AddIcon />
          </Fab>
          <Fab 
            color="error" 
            aria-label="add expense"
            size="medium"
            onClick={() => navigate('/expense')}
            sx={{ boxShadow: 2 }}
          >
            <RemoveIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;