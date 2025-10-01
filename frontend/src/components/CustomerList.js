import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Customer = props => (
  <tr>
    <td>{props.customer.customerID}</td>
    <td>{props.customer.name}</td>
    <td>
      <Link to={"/deposit/"+props.customer._id}>Add Deposit</Link> | <Link to={"/view/"+props.customer._id}>View Deposits</Link>
    </td>
  </tr>
)

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/customers/')
      .then(response => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customerList = () => {
    return filteredCustomers.map(currentcustomer => {
      return <Customer customer={currentcustomer} key={currentcustomer._id}/>;
    })
  }

  return (
    <div>
      <h3>Customers</h3>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID or Name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { customerList() }
        </tbody>
      </table>
    </div>
  )
}
