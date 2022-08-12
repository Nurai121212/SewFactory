import s from './style.module.sass';
import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import User from '../../store/User';
import {Navigate} from 'react-router-dom';
import { useState } from 'react';
import MyButton from '../../components/UI/MyButton';
import CustomerProfile from '../../components/CustomerProfile';
import SewerProfile from '../../components/SewerProfile';
import Account from '../../components/Account';

export default observer(function Profile(){
  const [activeTab, setActiveTab] = useState(1);

  //функция для табов
  const toggleTab = (index) => {
    setActiveTab(index)
  }

  //функция для кнпоки выхода
  const logOut = () => {
    User.removeUser();
  }

  if(!User.user){
    return <Navigate to={'/'}/>
  }

  return(
    <>
      <div className={s.logOutBtn}>
        <p>Выйти из аккаунта ?</p>
        <MyButton onClick={() => logOut()}>Выйти</MyButton>
      </div>

      <div className={s.tabHeader}>
        <div 
          className={classNames(s.profileHead, {[s.active] : activeTab === 1})} 
          onClick={() => toggleTab(1)}
        >
          Аккаунт
        </div>
        {!User.premissions.isAdmin && 
        <div 
          className={classNames(s.profileHead, {[s.active] : activeTab === 2})} 
          onClick={() => toggleTab(2)}
        >
          Профиль
        </div>}
      </div>

      <div>
        <div className={classNames(s.profileContent, {[s.active] : activeTab === 1})}>
          <Account/>
        </div>
        {!User.premissions.isAdmin && 
        <div className={classNames(s.profileContent, {[s.active] : activeTab === 2})}>
          {User.premissions.isCustomer ? <CustomerProfile/> : <SewerProfile/>}
        </div>}
      </div>
    </>
  )
})