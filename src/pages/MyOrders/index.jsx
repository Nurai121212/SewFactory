import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import Table, { SelectColumnFilter } from '../../components/Table';
import Preloader from '../../components/Preloader';
import MyButton from '../../components/UI/MyButton';
import OrderPopUp from '../../components/PopUps/Order';
import Error from '../../components/Error';

export default observer(function MyOrders(){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    if(User.user){
      handleFetch({method: 'get', url: `/order/get-customer-orders/${User.user.id}`})
        .then(res => {
          setData(res)
        }).catch(e => {
          console.log(e);
          setNoData(true)
        }).finally(() => {
          setLoading(false)
        })
    }
  }, [modalActive, loading])

  //столбцы для таблицы
  const columns = useMemo(() => [
    {Header: 'Модель', accessor : 'clothesType', Filter: SelectColumnFilter, filter: 'includes'},
    {Header: 'Кол-во', accessor : 'amount', Filter: SelectColumnFilter, filter: 'includes'},
    {Header: 'Статус',accessor : 'status', Filter: SelectColumnFilter, filter: 'includes'}
  ], []);

  //запрос добавления заказа
  const onSubmit = (values) => {
    return handleFetch({ method: 'post', url: '/order/add-order', 
      body: {
      ...values,
      customerId: User.user.id}
    })
  };

  if(User.user && User.premissions.isCustomer){
    return(
      <>
        <OrderPopUp 
          active={modalActive} 
          setActive={setModalActive}
          submitFunc={onSubmit}
        />

        {loading ? <Preloader/> : noData ? <Error/> : 
          <>
            <div className={s.myOrdersHead}>
              <h1>Ваши Заказы</h1>
              <MyButton onClick={() => setModalActive(true)}>Добавить Заказ</MyButton>
            </div>
            <div className={s.myOrdersFooter}>
              {data.length ? <Table columns={columns} data={data} url={'order'}/> : <h2>Пока нет заказов</h2>}
            </div>
          </>
        }
      </>
    )
  }

  return <Navigate to={'/auth'}/>
})