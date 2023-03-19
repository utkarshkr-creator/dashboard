import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react'

const DataTable = () => {
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/user/alldata');
      setData(data);
    }
    fetchData();
  }, [add])
  const deleteHandler = async (id) => {
    if (window.confirm("bhai Mn se delete kr ")) {
      const { data } = await axios.get(`https://techmiti.org/api/user/deleteReceipt?id=${id}`);
      setAdd(add + 1);

    }

  }
    return (
        <div className="App"  >
          <div >
            <table>
              <thead >
                <tr>
                  <th>Name</th>
                  <th>TECHMITIID</th>
                  <th>college</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>tshirt size</th>
                  <th>Payment mode</th>
                  <th>CA Id</th>
                  <th>transaction ID</th>
                  <th>isVerify</th>
                  <th>Accomo<br/>dation</th>
                  <th>Delete Receipt</th>
                  
    
                </tr>
              </thead>
              <tbody>
                {data && data.map((demo) => (
                  <tr >
                    <td>{demo.name}</td>
                    <td>{demo.techmitiId}</td>
                    <td>{demo.college}</td>
                    <td>{demo.phone}</td>
                    <td>{demo.email}</td>
                    <td>{demo.gender}</td>
                    <td>{demo.tshirtSize}</td>
                    <td>{demo.paymentMode}</td>
                    <td>{demo.caCode}</td>
                    <td>{demo.transactionId}</td>
                    <td>{demo.isPaymentVerified ? 'yes' : 'no'}</td>
                    <td>{demo.isAccommodation ? 'yes' : 'no'}</td>
                    <td>{demo.isReceiptDeleted ? 'Deleted' : <button disabled={!demo.isPaymentVerified} onClick={() => deleteHandler(demo._id)}>Delete receipt</button>}</td>
    
    
                  </tr>
                ))
                }
              </tbody>
            </table>
    
          </div>
        </div>
      )
}

export default DataTable