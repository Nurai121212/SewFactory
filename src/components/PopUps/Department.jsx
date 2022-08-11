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
  departmentName: yup.string().required('Введите название отдела')
})

export default function DepartmentPopUp({active, setActive, submitFunc, defaultValues}){
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
    }catch{
      setError(`Ошибка. Попробуйте снова`)
    }finally{
      setLoading(false)
    }
  }

  return(
    <PopUp active={active} setActive={setActive}>
      {error && <span>{error}</span>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          error={errors?.departmentName?.message}
          id='departmentName'
          label='Название Отдела:'
          {...register("departmentName")}
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