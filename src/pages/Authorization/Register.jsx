import s from './style.module.sass';
import User from '../../store/User';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import handleFetch from '../../apiRequest';
import Form from '../../components/UI/Form';
import { Input } from '../../components/UI/Input';
import MyButton from '../../components/UI/MyButton';
import { useState } from 'react';

//валидация
const schema = yup.object().shape({
  login: yup.string().required('Введите Логин').matches(/^[a-zA-Z]+$/, 'Только буквы'),
  email: yup.string().required('Введите Почту').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Почта не валидна'),
  password: yup.string().required('Введите Пароль'),
  role: yup.string().required()
})

export default function Register({setSignUp}){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

    handleFetch({method:'post', url: 'users/register',body: values})
      .then(res => {
        User.setUser(res)
      }).catch((error) => {
        if (error.response.status === 500) {
          setError(`Пользаватель с таким именем уже существует`)
        } else{
          setError(`Ошибка. Попробуйте снова`)
        }
      }).finally(() => {
        setLoading(false)
      })
  };

  return(
    <>
      <h1>Зарегистрируйтесь</h1>
      {error && <span>{error}</span>}
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <div className={s.radioContainer}>
          <div>
            <Input
              id='customer'
              nameGroup='role'
              value='ROLE_CUSTOMER'
              type='radio'
              label='Заказчик'
              {...register("role")}
            />
            <Input
              id='sewer'
              nameGroup='role'
              value='ROLE_SEWER'
              type='radio'
              label='Сотрудник'
              {...register("role")}
            />
          </div>
          {errors?.role && <span>Выберите роль</span>}
        </div>
        <MyButton disabled={loading}>
          {loading ? 'Загрузка...' : 'Отправить'}
        </MyButton>
      </Form>
      <button disabled={loading} onClick={() => setSignUp(false)}>
        Войти в аккаунт
      </button>
    </>
  )
}