import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from "./Layouts/App-Layout.jsx";
import GuestLayout from "./Layouts/Guest-Layout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/Auth/Login.jsx";
import { routes } from "./routes/index.js";
import Index from "./Pages/Users/Index.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routes.home} element={<AppLayout />} >
          <Route path={routes.dashboard} element={<Dashboard />}/>
          <Route path={routes.users} element={<Index />}/>
        </Route>
        <Route path={routes.home} element={<GuestLayout />} >
          <Route path={routes.login} element={<Login />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
