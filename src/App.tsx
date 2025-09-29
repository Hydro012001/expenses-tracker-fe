import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import About from "./pages/About";

import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { Layout } from "./layout/layout";
import { ThemeProvider } from "./components/theme-provider";
import { GlobalAlert } from "./components/custom/globalalert";
import NotFound from "./pages/error/NotFound";
import Signup from "./pages/auth/Signup";
import Verify from "./pages/Verify";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalAlert />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
