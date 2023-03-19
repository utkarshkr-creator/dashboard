import React from 'react'
import DataTable from './DataTable'
import Verification from './Varification'
import {Routes,Route} from 'react-router-dom'

const App = () => {
  return (
    <Routes>
       <Route path="/" element={<Verification/>}/>
       <Route path="/datatable" element={<DataTable/>}/>
    </Routes>
  )
}

export default App