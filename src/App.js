import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Authorization from './pages/Authorization';
import MyOrders from './pages/MyOrders';
import OrderPage from './pages/OrderPage';
import Departments from './pages/Departments';
import DepartmentPage from './pages/DepartmentPage';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import UsersPage from './pages/Users';
import Profile from './pages/Profile';
import SewerPage from './pages/SewerPage';
import CustomerPage from './pages/CustomerPage';

function App() {
  return(
    <>
      <Header/>
      <div className="app-container">
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/auth' element={<Authorization/>}/>
          <Route path='/myorders' element={<MyOrders/>}/>
          <Route path='/departments' element={<Departments/>}/>
          <Route path='/users' element={<UsersPage/>}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/order/:id' element={<OrderPage/>}/>
          <Route path='/department/:id' element={<DepartmentPage/>}/>
          <Route path='/sewer/:id' element={<SewerPage/>}/>
          <Route path='/customer/:id' element={<CustomerPage/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App;
