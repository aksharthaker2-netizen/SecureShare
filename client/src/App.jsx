import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SharedFile from "./pages/SharedFile";
import ProtectedRoute from "./components/ProtectedRoute";
import ShareLinks from "./pages/ShareLinks";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>
        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
        <Route
  path="/shares/:fileId"
  element={
    <ProtectedRoute>
      <ShareLinks />
    </ProtectedRoute>
  }
/>
        <Route
         path="/"
        element={<Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
        path="/share/:token"
        element={<SharedFile />}
      />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;