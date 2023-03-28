import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import event from './data'
import axios from 'axios';

function Verification() {
  const [data, setData] = useState([]);
  const [eventchange, seteventchange] = useState();
  const [add, setAdd] = useState(0);
  const navigate=useNavigate();
  const eventdownloadhandler = () => {
    window.open(`http://localhost:5000/api/user/download?id=${eventchange}`);
  }
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/user/unvieriedata');
      setData(data);
    }
    fetchData();
  }, [add])
  const downloadHandler = async (id) => {
    window.open(`https://techmiti.org/api/user/downloadReceipt?id=${id}`);
  }
  const verifyHandler = async (id) => {
    if (window.confirm("bhai Mn se verify kr ")) {
      const { data } = await axios.get(`http://localhost:5000/api/user/verified?id=${id}`);
      setAdd(add + 1);

    }

  }
  const handlechange=()=>{
      navigate('/datatable')
  }
  const deleteUserHandler = async (id) => {
    if (window.confirm("bhai pakka na baad me rona mat ")) {
      const { data } = await axios.get(`http://localhost:5000/api/user/deleteUser?id=${id}`);
      setAdd(add + 1);

    }

  }
 return (
    <div className="App">
      <div>
        <button onClick={handlechange}>Bhai sb data yha milega</button>
        <p>bhai event select kr </p>

        <select onChange={(e) => { seteventchange(e.target.value) }}>
          <option>Select Event</option>
          {event.map((event) => (
            <option key={event.id} value={event.id} >
              {event.name}
            </option>
          ))}
        </select>
        <button disabled={!eventchange} onClick={eventdownloadhandler}>Download</button>
        
        <p>total unverified: {data.length}</p>
        <table>
          <thead >
            <tr>
              <th>Name</th>
              <th>TECHMITIID</th>
              <th>Date</th>
              <th>college</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Payment mode</th>
              <th>CA Id</th>
              <th>transaction ID</th>
              <th>show Receipt</th>
              <th>Verify</th>
              
              <th>Delete User</th>

            </tr>
          </thead>
          <tbody>
            {data && data.map((demo) => (
              <tr >
                <td>{demo.name}</td>
                <td>{demo.techmitiId}</td>
                <td>{demo.createdAt}</td>
                <td>{demo.college}</td>
                <td>{demo.phone}</td>
                <td>{demo.email}</td>
                <td>{demo.paymentMode}</td>
                <td>{demo.caCode}</td>
                <td>{demo.transactionId}</td>
                <td><button onClick={() => window.open(demo.receipt)}>show</button></td>
                <td><button onClick={() => verifyHandler(demo._id)}>verify</button></td>
                
                <td>{<button  onClick={() => deleteUserHandler(demo._id)}>Delete user</button>}</td>



              </tr>
            ))
            }
          </tbody>
        </table>

      </div>
    </div>
 )

  
}

export default Verification
