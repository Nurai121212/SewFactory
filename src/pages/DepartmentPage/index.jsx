import s from './style.module.sass';
import {observer} from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import MyButton from '../../components/UI/MyButton';
import DepartmentPopUp from '../../components/PopUps/Department';
import Preloader from '../../components/Preloader';
import Error from '../../components/Error';

export default observer(function DepartmentPage(){
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    handleFetch({method: 'get', url: `/department/${params.id}`})
      .then(res => {
        setData(res)
      }).catch(e => {
        console.log(e);
      }).finally(() => {
        setLoading(false)
      })
  }, [modalActive, loading, params]);

  //запрос на изменение отдела
  const changeDepartment = (values) => {
    return handleFetch({method: 'put', url: `/department/${params.id}`, body: values})
  }

  //удаление отдела
  const deleteDepartment = () => {
    setLoading(true);

    handleFetch({method: 'delete', url: `/department/${params.id}`})
      .then(() => {
        return navigate(-1)
      }).catch(e => {
        console.log(e);
      }).finally(() => {
        setLoading(false)
      })
  };

  if(User.user && User.premissions.isAdmin){
    return(
      <>
        <DepartmentPopUp
          active={modalActive}
          setActive={setModalActive}
          submitFunc={changeDepartment}
          defaultValues={data}
        />
        
        {loading ? <Preloader/> : data ? <div className={s.departmentContainer}>
          <div className={s.departmentContent}>
            <div className={s.contentTitle}>
              <h1>Имя: {data.departmentName}</h1>
              <span>{data.status || 'нету заказа'}</span>
            </div>
            <div className={s.contentTable}>
              <div>
                <div>Кол-во:</div>
                <div>{data.amount || "нету"}</div>
              </div>
              <div>
                <div>Модель:</div>
                <div>{data.clothType || "нету"}</div>
              </div>
              <div>
                <div>Цена(за 1шт):</div>
                <div>{data.unitPrice || "нету"}</div>
              </div>
            </div>
          </div>
          <div className={s.departmentFooter}>
            <MyButton onClick={() => setModalActive(true)}>Изменить</MyButton>
            <MyButton onClick={deleteDepartment}>Удалить</MyButton>
          </div>
        </div> : <Error/>}
      </>
    )
  }

  return <Navigate to={'/'}/>
})