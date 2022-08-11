import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import Cookies from 'js-cookie';
import handleFetch from '../../apiRequest';
import { useEffect } from 'react';

export default observer(function Home(){
  //поиск по токену
  useEffect(() => {
    const token = Cookies.get('my_token');
    
    if(token){
      handleFetch({method: 'get', url: 'users/find-user', headers: {
        Authorization: token
      }})
      .then(res => {
        User.setUser(res)
      }).catch((e) => {
        console.log(e);
      })
    }
  }, []);

  return(
    <div className={s.homeContainer}>
      <div></div>
      {User.user ? <h1>Здравствуйте, {User.user.login}!</h1> : <h1>Вы не авторизованы.</h1>}
    </div>
  )
})