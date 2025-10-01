import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function DepositForm(props) {
  const [selectedCustomerID, setSelectedCustomerID] = useState('');
  const [customers, setCustomers] = useState([]);
  const [week, setWeek] = useState(1);
  const [amount, setAmount] = useState(0);

  const { id } = useParams(); // This `id` is the MongoDB _id from the URL

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/customers/')
      .then(response => {
        if (response.data.length > 0) {
          const fetchedCustomers = response.data.map(customer => ({ id: customer._id, customerID: customer.customerID }));
          setCustomers(fetchedCustomers);

          // If an id (MongoDB _id) is in the URL, find the corresponding customerID
          if (id) {
            const customerFromUrl = fetchedCustomers.find(cust => cust.id === id);
            if (customerFromUrl) {
              setSelectedCustomerID(customerFromUrl.customerID);
            } else {
              // Fallback if URL id doesn't match any customer
              setSelectedCustomerID(fetchedCustomers[0].customerID);
            }
          } else {
            setSelectedCustomerID(fetchedCustomers[0].customerID);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }, [id]); // Depend on 'id' so it re-runs if id changes

  const onChangeCustomerID = (e) => {
    setSelectedCustomerID(e.target.value);
  }

  const onChangeWeek = (e) => {
    setWeek(e.target.value);
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    // Find the customer object using the selectedCustomerID string
    const customer = customers.find(cust => cust.customerID === selectedCustomerID);

    if (customer) {
      const deposit = {
        customer: customer.id, // Use the MongoDB _id for the deposit
        week: week,
        amount: amount,
      };

      console.log(deposit);

      axios.post(process.env.REACT_APP_BACKEND_URL+'/deposits/add', deposit)
        .then(res => console.log(res.data));

      window.location = '/';
    } else {
      console.log("Customer not found");
    }
  }

  return (
    <div>
      <h3>Create New Deposit</h3>
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
          <input type="submit" value="Create Deposit" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}
