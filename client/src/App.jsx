import './styles/index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
