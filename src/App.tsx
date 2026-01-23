import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { Dashboard } from './components/Dashboard';
import { NavigationMenu } from './components/NavigationMenu';
import { GenealogyPage } from './pages/GenealogyPage';
import { TimelinePage } from './pages/TimelinePage';

function App() {
  return (
    <Router>
      <NavigationMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmacao" element={<ConfirmationPage />} />
        <Route path="/genealogica" element={<GenealogyPage />} />
        <Route path="/linhagem" element={<TimelinePage />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
