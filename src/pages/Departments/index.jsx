import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { Navigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Table from '../../components/Table';
import Preloader from '../../components/Preloader';
import DepartmentPopUp from '../../components/PopUps/Department';
import MyButton from '../../components/UI/MyButton';
import Error from '../../components/Error';

export default observer(function Departments(){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    handleFetch({method: 'get', url: '/department'})
      .then(res => {
        setData(res)
      }).catch(e => {
        console.log(e);
        setNoData(true);
      }).finally(() => {
        setLoading(false)
      })
  }, [modalActive]);

  //столбцы для таблицы
  const columns = useMemo(() => [
    {Header: 'Название', accessor : 'departmentName'}
  ], []);

  //запрос добавление отдела
  const addDepartment = (values) => {
    return handleFetch({method: 'post', url: '/department/add-department', body: values})
  }

  if(User.user && User.premissions.isAdmin){
    return(
      <>
        <DepartmentPopUp
          active={modalActive}
          setActive={setModalActive}
          submitFunc={addDepartment}
        />

        {loading ? <Preloader/> : noData ? <Error/> :
          <>
            <div className={s.departmentsHead}>
              <h1>Все Отделы</h1>
              <MyButton onClick={() => setModalActive(true)}>Добавить Отдел</MyButton>
            </div>
            <div className={s.departmentsFooter}>
              {data.length ? <Table columns={columns} data={data} url={'department'}/> : <div>Здесь пока ничего нет</div>}
            </div>
          </>}
      </>
    )
  }

  return <Navigate to={'/auth'}/>
})