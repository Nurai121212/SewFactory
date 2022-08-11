import s from './style.module.sass';
import User from '../../store/User';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default observer(function Authorization(){
  const [isSignUp, setSignUp] = useState(false); //состояние формы

  if(!User.user){
    return(
      <div className={s.authBody}>
        <div className={s.authLeft}>
          {isSignUp ? 
            <Register setSignUp={setSignUp}/> 
              : 
            <Login setSignUp={setSignUp}/>}
        </div>
        <div className={s.authRight}></div>
      </div>
    )
  }

  return <Navigate to={'/'}/>
});