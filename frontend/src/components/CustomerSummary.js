import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerSummary.css'; // Import the new CSS file

export default function CustomerSummary() {
  const [customers, setCustomers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [weeklyTotals, setWeeklyTotals] = useState({});

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/customers/')
      .then(response => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.log("Error fetching customers:", error);
      })

    axios.get(process.env.REACT_APP_BACKEND_URL+'/deposits/')
      .then(response => {
        setDeposits(response.data);
      })
      .catch((error) => {
        console.log("Error fetching deposits:", error);
      })
  }, []);

  useEffect(() => {
    if (customers.length > 0 && deposits.length > 0) {
      const totals = {};
      for (let i = 1; i <= 52; i++) {
        totals[i] = 0;
      }

      deposits.forEach(deposit => {
        if (totals[deposit.week] !== undefined) {
          totals[deposit.week] += deposit.amount;
        }
      });
      setWeeklyTotals(totals);
    }
  }, [customers, deposits]);

  const getCustomerWeeklyDeposit = (customerId, week) => {
    const deposit = deposits.find(dep => dep.customer._id === customerId && dep.week === week);
    return deposit ? deposit.amount : 0;
  };

  const getCustomerTotalDeposit = (customerId) => {
    const customerDeposits = deposits.filter(dep => dep.customer._id === customerId);
    return customerDeposits.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const renderWeeklyHeaders = () => {
    const headers = [];
    for (let i = 1; i <= 52; i++) {
      headers.push(<th key={i} className="sticky-header">Week {i}</th>);
    }
    return headers;
  };

  const renderCustomerRows = () => {
    return customers.map(customer => {
      const customerId = customer._id;
      const customerTotal = getCustomerTotalDeposit(customerId);
      const weeklyAmounts = [];
      for (let i = 1; i <= 52; i++) {
        weeklyAmounts.push(<td key={i}>{getCustomerWeeklyDeposit(customerId, i)}</td>);
      }

      return (
        <tr key={customer._id}>
          <td className="sticky-col-1">{customer.customerID}</td>
          <td className="sticky-col-2">{customer.name}</td>
          {weeklyAmounts}
          <td>{customerTotal}</td>
        </tr>
      );
    });
  };

  const renderOverallWeeklyTotalsRow = () => {
    const weekTotalCells = [];
    for (let i = 1; i <= 52; i++) {
      weekTotalCells.push(<td key={i}>{(weeklyTotals[i] || 0)}</td>);
    }
    return (
      <tr className="overall-totals-row">
        <td className="sticky-col-1 sticky-bottom"></td>
        <td className="sticky-col-2 sticky-bottom"><b>Weekly Totals</b></td>
        {weekTotalCells}
        <td><b>{Object.values(weeklyTotals).reduce((acc, curr) => acc + curr, 0)}</b></td>
      </tr>
    );
  };

  return (
    <div>
      <h3>Customer Deposit Summary</h3>
      <div className="table-responsive-scroll" style={{ overflowX: 'auto' }}>
        <table className="table table-bordered customer-summary-table">
          <thead className="thead-light">
            <tr>
              <th className="sticky-col-1 sticky-header">Customer ID</th>
              <th className="sticky-col-2 sticky-header">Name</th>
              {renderWeeklyHeaders()}
              <th className="sticky-header">Total</th>
            </tr>
          </thead>
          <tbody>
            {renderCustomerRows()}
            {renderOverallWeeklyTotalsRow()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
