import React, { useState } from 'react';
import axios from 'axios';

export default function CreateCustomer() {
  const [customerID, setCustomerID] = useState('');
  const [name, setName] = useState('');

  const onChangeCustomerID = (e) => {
    setCustomerID(e.target.value);
  }

  const onChangeName = (e) => {
    setName(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const customer = {
      customerID: customerID,
      name: name,
    };

    console.log(customer);

    axios.post(process.env.REACT_APP_BACKEND_URL+'/customers/add', customer)
      .then(res => console.log(res.data))
      .catch(error => {
        console.log("Error adding customer:", error.response.data);
      });

    setCustomerID('');
    setName('');
  }

  return (
    <div>
      <h3>Create New Customer</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Customer ID: </label>
          <input type="text"
            required
            className="form-control"
            value={customerID}
            onChange={onChangeCustomerID}
            />
        </div>
        <div className="form-group">
          <label>Name: </label>
          <input type="text"
            required
            className="form-control"
            value={name}
            onChange={onChangeName}
            />
        </div>
        <div className="form-group">
          <input type="submit" value="Create Customer" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}
