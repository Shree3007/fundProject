import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeeklyDeposit() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [customerID, setCustomerID] = useState('');
  const [amount, setAmount] = useState(0);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/customers/')
      .then(response => {
        if (response.data.length > 0) {
          setCustomers(response.data.map(customer => ({ id: customer._id, customerID: customer.customerID })));
        }
      })
      .catch((error) => {
        console.log("Error fetching customers:", error);
      })
  }, []);

  const onChangeWeek = (e) => {
    setSelectedWeek(Number(e.target.value));
  };

  const onChangeCustomerID = (e) => {
    setCustomerID(e.target.value);
  };

  const onChangeAmount = (e) => {
    setAmount(Number(e.target.value));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const customer = customers.find(cust => cust.customerID === customerID);

    if (customer) {
      const deposit = {
        customer: customer.id,
        week: selectedWeek,
        amount: amount,
      };

      console.log(deposit);

      axios.post(process.env.REACT_APP_BACKEND_URL+'/deposits/add', deposit)
        .then(res => {
          console.log(res.data);
          alert('Deposit added successfully!');
          setCustomerID('');
          setAmount(0);
        })
        .catch(err => console.log("Error adding deposit:", err));
    } else {
      console.log("Customer not found");
      alert("Customer not found. Please enter a valid Customer ID.");
    }
  };

  const weeks = [];
  for (let i = 1; i <= 52; i++) {
    weeks.push(<option key={i} value={i}>Week {i}</option>);
  }

  return (
    <div>
      <h3>Weekly Deposit</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Select Week: </label>
          <select
            required
            className="form-control"
            value={selectedWeek}
            onChange={onChangeWeek}
          >
            {weeks}
          </select>
        </div>
        <div className="form-group">
          <label>Customer ID: </label>
          <input
            type="text"
            required
            className="form-control"
            value={customerID}
            onChange={onChangeCustomerID}
            placeholder="Enter Customer ID"
          />
        </div>
        <div className="form-group">
          <label>Amount: </label>
          <input
            type="number"
            required
            className="form-control"
            value={amount}
            onChange={onChangeAmount}
            min="0"
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Add Weekly Deposit" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
