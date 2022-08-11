import s from './style.module.sass';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Form from '../UI/Form';
import { Input } from '../UI/Input';
import MyButton from '../UI/MyButton';

//валидация
const schema = yup.object().shape({
  login: yup.string().required('Введите Логин').matches(/^[a-zA-Z]+$/, 'Только буквы'),
  email: yup.string().required('Введите Почту').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Почта не валидна'),
  password: yup.string().required('Введите Пароль')
})

export default function Account(){
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    register, 
    reset,
    handleSubmit, 
    formState : {
      errors
    }} = useForm({ 
      mode: "onBlur",
      resolver: yupResolver(schema)
    });

  useEffect(() => {
    reset(User.user)
  }, [reset]);

  //изменение данных
  const onSubmit =(values) => {
    setLoading(true)

    handleFetch({method: 'put', url: `/users/${User.user.id}`, body: values})
      .then(() => {
        User.removeUser();
        return navigate('/auth')
      }).catch(e => {
        console.log(e);
        setError('Произошла ошибка. Попробуйте еще раз')
      }).finally(() => {
        setLoading(false)
      })
  }

  //удаление юзера
  const onDelete = (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    
    handleFetch({method: 'delete', url: `/users/${User.user.id}`})
      .then(() => {
        User.removeUser();
        return navigate('/auth')
      }).catch(e => {
        console.log(e);
        setError('Произошла ошибка. Попробуйте еще раз')
      }).finally(() => {
        setDeleteLoading(false)
      })
  }

  return(
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <span>{error}</span>}
      <Input
        error={errors?.email?.message}
        id='email'
        type="email"
        label='Почта:'
        {...register("email")}
      />
      <Input
        error={errors?.login?.message}
        id='login'
        label='Логин:'
        {...register("login")}
      />
      <Input
        error={errors?.password?.message}
        id='password'
        label='Пароль:'
        type='password'
        {...register("password")}
      />
      <div className={s.formFooter}>
        <MyButton disabled={loading}>
          {loading ? 'Загрузка...' : 'Сохранить'}
        </MyButton>
        <MyButton disabled={deleteLoading} onClick={onDelete}>
          {deleteLoading ? 'Загрузка...' : 'Удалить'}
        </MyButton>
      </div>
    </Form>
  )
}