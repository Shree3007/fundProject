import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const CustomerDepositTable = props => (
  <tr>
    <td>{props.deposit.customer.customerID}</td>
    <td>{props.deposit.customer.name}</td>
    <td>{props.deposit.week}</td>
    <td>{props.deposit.amount}</td>
    <td>
      <Link to={"/edit-deposit/"+props.deposit._id}>Edit</Link> | <a href="#" onClick={() => { props.deleteDeposit(props.deposit._id) }}>Delete</a>
    </td>
  </tr>
)

export default function CustomerDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [customer, setCustomer] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    fetchDeposits();
  }, [id]);

  const fetchDeposits = () => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/customers/' + id)
      .then(response => {
        setCustomer(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

    axios.get(process.env.REACT_APP_BACKEND_URL+'/deposits/')
      .then(response => {
        const customerDeposits = response.data.filter(dep => dep.customer._id === id);
        setDeposits(customerDeposits);
        const total = customerDeposits.reduce((acc, curr) => acc + curr.amount, 0);
        setTotalAmount(total);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const deleteDeposit = (depositId) => {
    axios.delete(process.env.REACT_APP_BACKEND_URL+'/deposits/' + depositId)
      .then(res => console.log(res.data));

    setDeposits(deposits.filter(el => el._id !== depositId));
  }

  const depositList = () => {
    return deposits.map(currentdeposit => {
      return <CustomerDepositTable deposit={currentdeposit} deleteDeposit={deleteDeposit} key={currentdeposit._id}/>;
    })
  }

  return (
    <div>
      <h3>Deposits for {customer.name} (ID: {customer.customerID})</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Week</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { depositList() }
        </tbody>
      </table>
      <h4>Total Amount Deposited: {totalAmount}</h4>
    </div>
  )
}
