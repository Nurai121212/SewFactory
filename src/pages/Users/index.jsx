import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames'
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Preloader from '../../components/Preloader';
import Table, { SelectColumnFilter } from '../../components/Table';
import Error from '../../components/Error';

export default observer(function Users(){
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  //загрузка заказчиков
  const loadCustomers = useCallback(() => {
    return handleFetch({method: 'get', url: `/customer`})
  }, [])

  //загрузка сотрудников
  const loadSewers = useCallback(() => {
    return handleFetch({method: 'get', url: `/sewer`})
  }, [])

  //функция для загружения данных
  const loadData =useCallback(async() => {
    try{
      const [customers, sewers] = await Promise.all([loadCustomers(), loadSewers()]);

      if(sewers && customers){
        setData({sewers, customers})
      }
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false)
    }
  }, [loadSewers, loadCustomers])

  useEffect(() => {
    if(User.user){
      loadData()
    }
  }, [loadData]);

  //функция для табов
  const toggleTab = (index) => {
    setActiveTab(index)
  }

  //столбцы для таблицы заказчиков
  const columnsCustomer = useMemo(() => [
    {
      Header: 'ФИО', 
      accessor : 'fio', 
    },
    {
      Header: 'ID', 
      accessor : 'id', 
    }
  ], []);

  //столбцы для таблицы сотрудников
  const columnsSewer = useMemo(() => [
    {
      Header: 'ФИО', 
      accessor : 'fio', 
    },
    {
      Header: 'ID', 
      accessor : 'id', 
    },
    {
      Header: 'Отдел', 
      accessor : 'departmentName',
      Filter: SelectColumnFilter,
      filter: 'includes' 
    }
  ], []);


  if(User.user && User.premissions.isAdmin){
    return(
      <>
        {loading ? <Preloader/> : data ? 
          <>
            <div className={s.tabHeader}>
              <div 
                className={classNames(s.tabHead, {[s.active] : activeTab === 1})} 
                onClick={() => toggleTab(1)}
              >
                Сотрудники
              </div>
              <div
                className={classNames(s.tabHead, {[s.active] : activeTab === 2})} 
                onClick={() => toggleTab(2)}
              >
                Заказчики
              </div>
            </div>

            <div className={classNames(s.tabContent, {[s.active] : activeTab === 1})} >
              {data.sewers.length ? <Table columns={columnsSewer} data={data.sewers} url={'sewer'}/> : <div>Здесь Ничего</div>}
            </div>

            <div className={classNames(s.tabContent, {[s.active] : activeTab === 2})} >
              {data.customers.length ? <Table columns={columnsCustomer} data={data.customers} url={'customer'}/> : <div>Здесь Ничего</div>}
            </div>
          </> : <Error/>}
      </>
    )
  }

  return <Navigate to={'/auth'}/>
})