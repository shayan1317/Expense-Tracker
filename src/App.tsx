import ProtectedRoute from "@components/ProtectedRoute";
import AuthProvider from "@context/AuthProvider";
import Login from "@pages/Auth/Login";
import Signup from "@pages/Auth/Signup";
import Home from "@pages/Dashboard/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import AddExpense from "@pages/Dashboard/AddExpense";
import AddIncome from "@pages/Dashboard/AddIncome";
import Expense from "@pages/Dashboard/Expense";
import Income from "@pages/Dashboard/Income";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import EditIncome from "@pages/Dashboard/EditIncome";
import EditExpense from "@pages/Dashboard/EditExpense";
import Settings from "@pages/Dashboard/Settings";
function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
      />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income/add"
              element={
                <ProtectedRoute>
                  <AddIncome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income/update/:id"
              element={
                <ProtectedRoute>
                  <EditIncome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense/add"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense/update/:id"
              element={
                <ProtectedRoute>
                  <EditExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
