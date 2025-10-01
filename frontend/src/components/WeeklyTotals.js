import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeeklyTotalTable = props => (
  <tr>
    <td>{props.weeklyTotal.week}</td>
    <td>{props.weeklyTotal.total}</td>
  </tr>
)

export default function WeeklyTotals() {
  const [weeklyTotals, setWeeklyTotals] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/deposits/')
      .then(response => {
        const totals = {};
        response.data.forEach(deposit => {
          if (totals[deposit.week]) {
            totals[deposit.week] += deposit.amount;
          } else {
            totals[deposit.week] = deposit.amount;
          }
        });
        const weeklyTotalsArray = Object.keys(totals).map(week => ({ week: Number(week), total: totals[week] }));
        setWeeklyTotals(weeklyTotalsArray.sort((a, b) => a.week - b.week));
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const weeklyTotalsList = () => {
    return weeklyTotals.map(currentTotal => {
      return <WeeklyTotalTable weeklyTotal={currentTotal} key={currentTotal.week}/>;
    })
  }

  return (
    <div>
      <h3>Weekly Deposit Totals</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Week</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          { weeklyTotalsList() }
        </tbody>
      </table>
    </div>
  )
}
