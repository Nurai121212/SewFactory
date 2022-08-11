import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { Navigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import Preloader from '../../components/Preloader';
import Table, { SelectColumnFilter } from '../../components/Table';
import Error from '../../components/Error';

export default observer(function Orders(){
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    handleFetch({method: 'get', url: '/order'})
      .then(res => {
        setData(res)
      }).catch(e => {
        console.log(e);
        setNoData(true);
      }).finally(() => {
        setLoading(false)
      })
  }, []);

  const columns = useMemo(() => [
    {Header: 'Модель', accessor : 'clothesType', Filter: SelectColumnFilter, filter: 'includes'},
    {Header: 'Кол-во', accessor : 'amount', Filter: SelectColumnFilter, filter: 'includes'},
    {Header: 'Статус',accessor : 'status', Filter: SelectColumnFilter, filter: 'includes'}
  ], []);

  if(User.user && User.premissions.isAdmin){
    return(
      <>
        {loading ? <Preloader/> : noData ? <Error/> :
          <>
            <div className={s.ordersHead}>
              <h1>Все Заказы</h1>
            </div>
            <div className={s.ordersFooter}>
              {data.length ? <Table columns={columns} data={data} url={'order'}/> : <div>Здесь ничего нет</div>}
            </div>
          </>}
      </>
    )
  }

  return <Navigate to={'/auth'}/>
})