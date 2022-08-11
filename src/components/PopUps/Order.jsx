import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../UI/Input';
import PopUp from '../UI/PopUp';
import MyButton from '../UI/MyButton';
import Form from '../UI/Form';

//валидация
const schema = yup.object().shape({
  amount: yup.number().required(),
  clothesType: yup.string().required('Введите Модель').matches(/^[ЁёА-яA-z]+$/, 'Только буквы'),
  unitPrice: yup.number().required(),
  description: yup.string()
})

export default function OrderPopUp({active, setActive, submitFunc, defaultValues}){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    if(defaultValues){
      reset(defaultValues)
    }
  }, [reset, defaultValues]);

  //отправка формы
  const onSubmit = async(values) => {
    try{
      setLoading(true);
      const res  = await submitFunc(values);
      
      if(res){
        setActive(false)
      }
    }catch(e){
      if (e.response.status === 500) {
        setError(`Ошибка Сервера. Убедитесь, что профиль заказчика существует`)
      } else{
        setError(`Ошибка. Попробуйте снова`)
      }
    }finally{
      setLoading(false)
    }
  }

  return(
    <PopUp active={active} setActive={setActive}>
      {error && <span>{error}</span>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          error={errors?.amount && 'Введите Число'}
          id='amount'
          label='Количество:'
          {...register("amount")}
        />
        <Input
          error={errors?.clothesType?.message}
          id='clothType'
          label='Модель:'
          {...register("clothesType")}
        />
        <Input
          error={errors?.unitPrice && 'Введите Число'}
          id='unitPrice'
          label='Цена (1 шт):'
          {...register("unitPrice")}
        />
        <Input
          id='description'
          label='Описание:'
          {...register("description")}
        />
        <MyButton
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Отправить'}
        </MyButton>
      </Form>
    </PopUp>
  )
}