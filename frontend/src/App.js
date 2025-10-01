import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import CustomerList from "./components/CustomerList";
import CreateCustomer from "./components/CreateCustomer";
import DepositForm from "./components/DepositForm";
import CustomerDeposits from "./components/CustomerDeposits";
import WeeklyTotals from "./components/WeeklyTotals";
import CustomerSummary from "./components/CustomerSummary";
import WeeklyDeposit from "./components/WeeklyDeposit";
import EditDeposit from "./components/EditDeposit";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg app-navbar">
        <Link to="/" className="navbar-brand app-navbar-brand">Fund Tracker</Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">Customers</Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">Create Customer</Link>
            </li>
            <li className="navbar-item">
              <Link to="/deposit-week" className="nav-link">Weekly Deposit</Link>
            </li>
            <li className="navbar-item">
              <Link to="/total" className="nav-link">Weekly Totals</Link>
            </li>
            <li className="navbar-item">
              <Link to="/summary" className="nav-link">Customer Summary</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content-wrapper">
        <br/>
        <Routes>
          <Route path="/" exact element={<CustomerList />} />
          <Route path="/create" element={<CreateCustomer />} />
          <Route path="/deposit/:id" element={<DepositForm />} />
          <Route path="/view/:id" element={<CustomerDeposits />} />
          <Route path="/total" element={<WeeklyTotals />} />
          <Route path="/summary" element={<CustomerSummary />} />
          <Route path="/deposit-week" element={<WeeklyDeposit />} />
          <Route path="/edit-deposit/:id" element={<EditDeposit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
