import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import NewOrders from '../../store/NewOrders';

export default observer(function Header(){
  const [burgerState, setBurgerState] = useState(false);
  const [stateValue, setStateValue] = useState([]);

  //запрос всех новых заказов
  useEffect(() => {
    handleFetch({method: 'get', url: '/order/count-new-orders'})
      .then(res => {
        NewOrders.increment(res)
        setStateValue(res)
      }).catch(e => {
        console.log(e);
      })
  }, [setStateValue]);

  //функция управления меню бургером
  const toggleBurger = () => {
    setBurgerState(!burgerState);

    if(!burgerState){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = '';
    }
  };

  //нужные ссылки рендерятся для специвльных ролей
  return(
    <header className={s.header}>
      <nav className={s.headerNav}>
        <div className={s.logo}>Sew Factory</div>

        <ul className={classNames(s.headerLinks, {[s.show] : burgerState})} onClick={() => setBurgerState(!burgerState)}>
          <li>
            <Link to={'/'}>Главная</Link>
          </li>

          {User.premissions && User.premissions.isCustomer && 
            <li>
              <Link to={'/myorders'}>Мои Заказы</Link>
            </li>
          }

          {User.premissions && User.premissions.isAdmin && <>
            <li>
              <Link to={'/orders'} className={NewOrders.orders ? s.newOrder : ''}>Заказы</Link>
            </li>
            <li>
              <Link to={'/departments'}>Отделы</Link>
            </li>
            <li>
              <Link to={'/users'}>Пользователи</Link>
            </li>
          </>}

          <li>
            {!User.user ? 
              <Link to={'/auth'}>Вход/Регистрация</Link>
               : 
              <Link to={'/profile'}>Профиль</Link>}
          </li>

        </ul>
          <div className={classNames(s.headerBurger, {[s.show] : burgerState})} onClick={toggleBurger}>
            <span></span>
            <span></span>
            <span></span>
          </div>
      </nav>
    </header>
  )
})