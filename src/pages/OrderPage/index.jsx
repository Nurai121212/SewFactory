import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import NewOrders from '../../store/NewOrders';
import handleFetch from '../../apiRequest';
import { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import Preloader from '../../components/Preloader';
import OrderPopUp from '../../components/PopUps/Order';
import AddOrderPopUp from '../../components/PopUps/AddOrder';
import MyButton from '../../components/UI/MyButton';
import Error from '../../components/Error';

export default observer(function OrderPage(){
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    handleFetch({method: 'get', url: `/order/${params.id}`})
      .then(res => {
        setData(res);

        if(res.newOrder && User.premissions.isAdmin){
          handleFetch({method: 'put', url: `/order/${res.id}`, body: {
            newOrder: false
          }})
          
          NewOrders.decriment();
        }
      }).catch(e => {
        console.log(e);
      }).finally(() => {
        setLoading(false)
      })
  }, [params, loading, modalActive]);

  //удаление заказа
  const deleteOrder = () => {
    setLoading(true);

    handleFetch({method: 'delete', url: `/order/${params.id}`})
      .then(() => {
        return navigate(-1)
      }).catch(e => {
        console.log(e);
      }).finally(() => {
        setLoading(false)
      })
  };

  //запрос изменения заказа
  const changeOrder = (values) => {
    return handleFetch({ method: 'put', url: `/order/${params.id}`, body: {
      ...values,
      newOrder: true
    }})
  };

  //заппрс добавления закзаа
  const addOrder = (values) => {
    return handleFetch({method: 'put', url: `/department/${values.departmentId}`, body: {
      orderId: params.id
    }})
  };

  //Отправление заказа
  const sendOrder = () => {
    setLoading(true);

    handleFetch({method: 'put', url: `/order/${params.id}`, body: {
      status: 'DONE'
    }}).catch(e => {
      console.log(e);
    }).finally(() => {
      setLoading(false)
    })
  };

  if(User.user && !User.premissions.isSewer){
    return(
      <>
        {User.premissions.isCustomer ? 
          <OrderPopUp
            active={modalActive}
            setActive={setModalActive}
            submitFunc={changeOrder}
            defaultValues={data}
          /> : 
          <AddOrderPopUp
            active={modalActive}
            setActive={setModalActive}
            submitFunc={addOrder}
          />}

        {loading ? <Preloader/> : data ? <div className={s.orderContainer}>
          <div className={s.orderContent}>
            <div className={s.contentTitle}>
              <h1>{data.clothesType}</h1>
              {User.premissions.isAdmin ? 
                <Link to={`/customer/${data.customerId}`}>{data.fio}</Link>
                 : 
                <p>{data.fio}</p>}
            </div>
            <div className={s.contentTable}>
              <div>
                <div>Кол-во:</div>
                <div>{data.amount}</div>
              </div>
              <div>
                <div>Цена(за 1шт):</div>
                <div>{data.unitPrice}</div>
              </div>
              <div>
                <div>Итог:</div>
                <div>{data.totalCost}(сом)</div>
              </div>
            </div>
            <div className={s.contentDesc}>
              <div>
                <h2>Статус:</h2>
                <span>{data.status}</span>
              </div>
              <div>
                <h3>Описание</h3>
                <p>{data.description}</p>
              </div>
            </div>
          </div> 
          <div className={s.orderFooter}>
            {data.status === 'WAITING' && (
              User.premissions.isCustomer ? 
              <>
                <MyButton onClick={() => setModalActive(true)}>Изменить</MyButton>
                <MyButton onClick={deleteOrder}>Удалить</MyButton>
              </> : <>
                <MyButton onClick={deleteOrder}>Удалить</MyButton>
                <MyButton onClick={() => setModalActive(true)}>Оформить</MyButton>
              </>
            )}
            {data.status === 'INPROCESS' && (
              User.premissions.isCustomer ? 
              <>
                <h5>Заказ в процессе</h5>
              </> : <>
                <MyButton onClick={deleteOrder}>Удалить</MyButton>
                <MyButton onClick={sendOrder}>Отправить</MyButton>
              </>
            )}
            {data.status === 'DONE' && <h6>Заказ отправлен</h6>}
          </div>
        </div> : <Error/>}
      </>
    )
  }

  return <Navigate to={'/auth'}/>
})