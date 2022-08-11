import { useEffect, useState } from 'react';
import handleFetch from '../../apiRequest';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../UI/Input';
import PopUp from '../UI/PopUp';
import MyButton from '../UI/MyButton';
import Form from '../UI/Form';

//валидация
const schema = yup.object().shape({
  departmentId: yup.number().required()
})

export default function AddOrderPopUp({active, setActive, submitFunc}){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [options, setOptions] = useState([])
  const {
    register, 
    handleSubmit, 
    formState : {
      errors
    }} = useForm({ 
      mode: "onBlur",
      resolver: yupResolver(schema)
    });

  useEffect(() => {
    handleFetch({method: 'get', url: '/department'})
      .then(res => {
        const data = res.filter(item => item.status !== 'INPROCESS');

        setOptions(data)
      }).catch(e => {
        console.log(e);
        setError(`Ошибка. Попробуйте снова`)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  //функция отправки формы
  const onSubmit = async(values) => {
    setLoading(true);

    try{
      const res  = await submitFunc(values);
      if(res){
        setActive(false)
      }
    }catch{
      setError(true)
    }finally{
      setLoading(false)
    }
  }

  return(
    <PopUp active={active} setActive={setActive}>
      <h1>Оформить Заказ</h1>
      {error && <span>{error}</span>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type='select'
          id='department-id'
          label='Выберите Отдел'
          options={options}
          error={errors?.departmentId && 'Поле обьязательно'}
          {...register('departmentId')}
        />
        <MyButton
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Добавить'}
        </MyButton>
      </Form>
    </PopUp>
  )
}