import { useState } from 'react';
import handleFetch from '../../apiRequest';
import User from '../../store/User';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Form from '../../components/UI/Form';
import { Input } from '../../components/UI/Input';
import MyButton from '../../components/UI/MyButton';

//валидация
const schema = yup.object().shape({
  email: yup.string().required('Введите Почту').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Почта не валидна'),
  password: yup.string().required('Введите Пароль')
})

export default function Login({setSignUp}){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const {
    register,
    handleSubmit, 
    formState : {
      errors
    }} = useForm({ 
      mode: "onBlur",
      resolver: yupResolver(schema)
    });

    
  //отправка формы
  const onSubmit = async(values) => {
    setLoading(true);

    handleFetch({method: 'post', url: 'users/auth', body: values})
      .then(res => {
        User.setUser(res)
      }).catch((error) => {
        if (error.response.status === 500) {
          setError(`Неверная почта или пароль`)
        } else{
          setError(`Ошибка. Попробуйте снова`)
        }
      }).finally(() => {
        setLoading(false)
      })
  };

  return(
    <>
      <h1>Войдите в аккаунт</h1>
      {error && <span>{error}</span>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          error={errors?.email?.message}
          type='email'
          id='email'
          label='Почта:'
          {...register("email")}
        />
        <Input
          error={errors?.password?.message}
          type='password'
          id='password'
          label='Пароль:'
          {...register("password")}
        />
        <MyButton disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </MyButton>
      </Form>
      <button disabled={loading} onClick={() => setSignUp(true)}>
        Зарегистрироваться
      </button>
    </>
  )
}