import s from './style.module.sass';
import {observer} from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { useForm } from 'react-hook-form';
import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Form from '../../components/UI/Form';
import { Input } from '../../components/UI/Input';
import MyButton from '../../components/UI/MyButton';
import Preloader from '../../components/Preloader';
import Error from '../../components/Error';

export default observer(function CustomerProfile(){
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);
  const { register, reset} = useForm({mode: "onBlur"});

  useEffect(() => {
    reset();

    handleFetch({method: 'get', url: `/customer/${params.id}`})
      .then(res => {
        reset(res)
      }).catch(e => {
        console.log(e);
        setNoData(true);
      }).finally(() => {
        setLoading(false)
      })
  }, [reset, loading, params]);

  //удаление профиля
  const onDelete = (e) => {
    e.preventDefault();
    setLoading(true);

    handleFetch({method: 'delete', url: `/customer/${params.id}`})
      .catch(e => {
        console.log(e);
        if (e.response.status === 500) {
          setError(`Ошибка. Убедитесь, что у заказчика нету дейвствующих заказов`)
        } else{
          setError(`Ошибка. Попробуйте снова`)
        }
      }).finally(() => {
        setLoading(false);
      })
  }

  return(
    <>
      { loading ? <Preloader/> : noData ? <Error/> : 
      <div className={s.customerContainer}>
        <h1>Заказчик №{params.id}</h1>
        <Form>
          {error && <span>{error}</span>}
          <Input
            disabled={User.premissions.isAdmin}
            id='fio'
            label='ФИО:'
            {...register("fio")}
          />
          <Input
            disabled={User.premissions.isAdmin}
            id='email'
            label='Почта:'
            {...register("email")}
          />
          <Input
            disabled={User.premissions.isAdmin}
            id='phoneNumber'
            label='Номер Телефона:'
            {...register("phoneNumber")}
          />
          <MyButton disabled={loading} onClick={onDelete}>
            Удалить
          </MyButton>
        </Form>
      </div> }
    </>
  )
})