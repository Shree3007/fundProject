import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EditDeposit() {
  const [selectedCustomerID, setSelectedCustomerID] = useState('');
  const [customers, setCustomers] = useState([]);
  const [week, setWeek] = useState(1);
  const [amount, setAmount] = useState(0);

  const { id } = useParams(); // This 'id' is the MongoDB _id of the deposit to edit

  useEffect(() => {
    // Fetch customers for the dropdown
    axios.get(process.env.REACT_APP_BACKEND_URL+'/customers/')
      .then(response => {
        if (response.data.length > 0) {
          setCustomers(response.data.map(customer => ({ id: customer._id, customerID: customer.customerID })));
        }
      })
      .catch((error) => {
        console.log("Error fetching customers:", error);
      });

    // Fetch the specific deposit to edit
    axios.get(process.env.REACT_APP_BACKEND_URL+'/deposits/' + id)
      .then(response => {
        const deposit = response.data;
        setSelectedCustomerID(deposit.customer.customerID); // Use the human-readable ID for display
        setWeek(deposit.week);
        setAmount(deposit.amount);
      })
      .catch(function (error) {
        console.log(error);
      })

  }, [id]);

  const onChangeCustomerID = (e) => {
    setSelectedCustomerID(e.target.value);
  }

  const onChangeWeek = (e) => {
    setWeek(Number(e.target.value));
  }

  const onChangeAmount = (e) => {
    setAmount(Number(e.target.value));
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const customer = customers.find(cust => cust.customerID === selectedCustomerID);

    if (customer) {
      const updatedDeposit = {
        customer: customer.id,
        week: week,
        amount: amount,
      };

      console.log(updatedDeposit);

      axios.post(process.env.REACT_APP_BACKEND_URL+'/deposits/update/' + id, updatedDeposit)
        .then(res => console.log(res.data));

      window.location = '/'; // Redirect to home page after update
    } else {
      console.log("Customer not found");
      alert("Customer not found. Please select a valid Customer.");
    }
  }

  const weeks = [];
  for (let i = 1; i <= 52; i++) {
    weeks.push(<option key={i} value={i}>Week {i}</option>);
  }

  return (
    <div>
      <h3>Edit Deposit</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Customer ID: </label>
          <select
            required
            className="form-control"
            value={selectedCustomerID}
            onChange={onChangeCustomerID}>
            {
              customers.map(function(customer) {
                return <option
                  key={customer.customerID}
                  value={customer.customerID}>{customer.customerID}
                  </option>;
              })
            }
          </select>
        </div>
        <div className="form-group">
          <label>Week: </label>
          <input
            type="number"
            required
            className="form-control"
            value={week}
            onChange={onChangeWeek}
            min="1"
            max="52"
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
          <input type="submit" value="Update Deposit" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}
