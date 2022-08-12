import s from './style.module.sass';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useParams, Navigate }from 'react-router-dom';
import Form from '../../components/UI/Form';
import { Input } from '../../components/UI/Input';
import MyButton from '../../components/UI/MyButton';
import Preloader from '../../components/Preloader';
import Error from '../../components/Error';

//валидация
const schema = yup.object().shape({
  departmentName: yup.string().required('Введите название'),
  needAmount: yup.number().required(),
  status: yup.string().required('Поле обязательно').matches(/^[A-Z]+$/, 'Только заглавные буквы')
})

export default observer(function SewerPage(){
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [error, setError] = useState(false);
  const {
    register, 
    reset,
    handleSubmit, 
    formState: {
      errors
    }} = useForm({ 
      mode: "onBlur",
      resolver: yupResolver(schema)
    });

  useEffect(() => {
    reset();

    handleFetch({method: 'get', url: `/sewer/${params.id}`})
      .then(res => {
        reset(res)
      }).catch(e => {
        console.log(e);
        setNoData(true);
      }).finally(() => {
        setLoading(false)
      })
  }, [reset, loading, params]);

  //функция отправки формы
  const onSubmit = (values) => {
    setLoading(true);
  
    handleFetch({method: 'put', url: `/sewer/${params.id}`, body: values})
      .catch(e => {
        console.log(e);
  
        setError('Произошла ошибка. Попробуйте еще раз')
      }).finally(() => {
        setLoading(false)
      })
  };

  //функция удаления профиля
  const onDelete = (e) => {
    e.preventDefault();
    setLoading(true)

    handleFetch({method: 'delete', url: `/sewer/${User.user.id}`})
      .catch(e => {
        console.log(e);
        setError('Произошла ошибка. Попробуйте еще раз')
      }).finally(() => {
        setLoading(false)
      })
  };

  if(User.user && User.premissions.isAdmin){
    return(
      <>
        { loading ? <Preloader/> : noData ? <Error/> : 
          <div className={s.sewerContainer}>
            <h1>Сотрудник №{params.id}</h1>
              <Form onSubmit={handleSubmit(onSubmit)}>
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
                <Input
                  disabled={User.premissions.isAdmin}
                  id='clothesType'
                  label='Тип Одежды:'
                  {...register("clothesType")}
                />
                <Input
                  error={errors?.departmentName?.message}
                  id='departmentName'
                  label='Название Отдела:'
                  {...register("departmentName")}
                />
                <Input
                  error={errors?.needAmount && 'Введите число'}
                  id='needAmount'
                  label='Требуемое Кол-во:'
                  {...register("needAmount")}
                />
                <Input
                  error={errors?.status?.message}
                  id='status'
                  label='Статус:'
                  {...register("status")}
                />
                <div className={s.sewerFooter}>
                  <MyButton disabled={loading}>
                    Сохранить
                  </MyButton>
                  <MyButton disabled={loading} onClick={onDelete}>
                    Удалить
                  </MyButton>
                </div>
              </Form>
          </div> }
      </>
    )
  }

  return <Navigate to={'/'}/>
});