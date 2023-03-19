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
        <table>
          <thead >
            <tr>
              <th>Name</th>
              <th>TECHMITIID</th>
              <th>college</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Payment mode</th>
              <th>CA Id</th>
              <th>transaction ID</th>
              <th>Download Receipt</th>
              <th>Verify</th>

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
                <td>{demo.paymentMode}</td>
                <td>{demo.caCode}</td>
                <td>{demo.transactionId}</td>
                <td><button onClick={() => downloadHandler(demo._id)}>download</button></td>
                <td><button onClick={() => verifyHandler(demo._id)}>verify</button></td>


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
