

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Plans from './pages/Plans'
import Layout from './components/Layout'
import PlanDetail from './pages/PlanDetail'
import ApplyTemrs from './pages/ApplyTerms'
import ApplyInfo from './pages/ApplyInfo'
import ApplyConfirm from './pages/ApplyConfirm'
import ApplyDone from './pages/ApplyDone'
import ApplicationList from './pages/ApplicationList'
import AddOns from './pages/AddOns'
import ApplicationDetail from './pages/ApplicationDetail'

function App() {

  return (
    <>
        <Routes>
            <Route element={<Layout/>}>
              <Route path='/' element={<Plans/>}></Route>
              <Route path='/planDetail/:id' element={<PlanDetail/>}></Route>
              <Route path='/apply/terms' element={<ApplyTemrs/>}></Route>
              <Route path='/apply/info' element={<ApplyInfo/>}></Route>
              <Route path='/apply/addons' element={<AddOns/>}></Route>
              <Route path='/apply/confirm' element={<ApplyConfirm/>}></Route>
              <Route path='/apply/done' element={<ApplyDone/>}></Route>
              <Route path='/applicationList' element={<ApplicationList/>}></Route>
              <Route path='/applicationDetail/:id' element={<ApplicationDetail/>}></Route>
              
            </Route>
        </Routes>
    </>
  )
}

export default App
