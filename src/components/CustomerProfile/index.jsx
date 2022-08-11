import s from './style.module.sass';
import {observer} from 'mobx-react-lite';
import User from '../../store/User';
import handleFetch from '../../apiRequest';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import Form from '../UI/Form';
import { Input } from '../UI/Input';
import MyButton from '../UI/MyButton';

//валидация
const schema = yup.object().shape({
  fio: yup.string().required('Введите ФИО').matches(/^[ЁёА-яA-z]+$/, 'Только буквы'),
  phoneNumber: yup.string().required("Введите Номер Телефона").matches(/\d+/, 'Только цифры')
})

export default observer(function CustomerProfile(){
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null)
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
    setData(null);
    reset();
  
    handleFetch({method: 'get', url: `/customer/${User.user.id}`})
      .then(res => {
        setData(res)
        reset(res)
      }).catch(e => {
        if (e.response.status === 500) {
          setError('Заполните данные на профиле !');
        } else{
          setError(`Ошибка. Попробуйте снова`)
        }
      }).finally(() => {
        setLoading(false)
      })
  }, [reset, loading, deleteLoading]);
  
  //выбор запроса
  const submitFunc=(values) => {
    setLoading(true);

    if(data){
      return handleFetch({method: 'put', url: `/customer/${User.user.id}`, body: values})
    }else{
      return handleFetch({method: 'post', url: `/customer/add-customer`, body: {
        ...values,
        userId: User.user.id}
      });
    }
  };

  //фукция отправки формы
  const onSubmit = (values) => {
    submitFunc(values)
      .catch(e => {
        console.log(e);
  
        setError('Произошла ошибка. Попробуйте еще раз')
      }).finally(() => {
        setLoading(false)
      })
  }

  //удаление профиля
  const onDelete = (e) => {
    e.preventDefault();
    setDeleteLoading(true);

    handleFetch({method: 'delete', url: `/customer/${User.user.id}`})
      .catch(e => {
        console.log(e);

        if (e.response.status === 500) {
          setError(`Ошибка. Убедитесь, что у заказчика нету дейвствующих заказов`)
        } else{
          setError(`Ошибка. Попробуйте снова`)
        }
      }).finally(() => {
        setDeleteLoading(false);
      })
  }

  return(
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <span>{error}</span>}
      <Input
        error={errors?.fio?.message}
        id='fio'
        label='ФИО:'
        {...register("fio")}
      />
      <Input
        error={errors?.phoneNumber?.message}
        id='phoneNumber'
        label='Номер Телефона:'
        {...register("phoneNumber")}
      />
        <div className={s.formFooter}>
          <MyButton disabled={loading}>
            {loading ? 'Загрузка...' : 'Сохранить'}
          </MyButton>
          {data && 
          <MyButton disabled={deleteLoading} onClick={onDelete}>
            {deleteLoading ? 'Загрузка...' : 'Удалить'}
          </MyButton>}
        </div>
    </Form>
  )
})