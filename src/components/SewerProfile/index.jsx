import handleFetch from '../../apiRequest';
import s from './style.module.sass';
import {observer} from 'mobx-react-lite';
import User from '../../store/User';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import Form from '../../components/UI/Form';
import { Input } from '../../components/UI/Input';
import MyButton from '../../components/UI/MyButton';
import SalaryPopUp from '../../components/PopUps/Salary';

export default observer(function SewerProfile(){
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [options, setOptions] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [error, setError] = useState(false);

  //валидация
  const schema = yup.object().shape({
    fio: yup.string().required().matches(/^[ЁёА-яA-z ]+$/, 'Только буквы'),
    phoneNumber: yup.string().required().matches(/\d+/, 'Только цифры'),
    departmentId: !data && yup.number().required()
  })
  
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

  //запрос массива отделов
  const loadOptions = () => {
    handleFetch({method: 'get', url: '/department'})
      .then(res => {
        const data = res.filter(item => item.departmentStatus !== 'INPROCESS');

        setOptions(data)
      }).catch(e => {
        console.log(e);
        setError('Ошибка !Попробуйте еще раз')
      });
  };

  useEffect(() => {
    setData(null);
    reset();

    handleFetch({method: 'get', url: `/sewer/${User.user.id}`})
      .then(res => {
        setData(res);
        reset(res)
      }).catch(e => {
        if (e.response.status === 500) {
          setError('Заполните данные на профиле !');
          loadOptions();
        } else{
          setError(`Ошибка. Попробуйте снова`)
        }
      }).finally(() => {
        setLoading(false)
      })
  }, [reset, loading, modalActive, deleteLoading]);

  //выбор запроса
  const submitFunc=(values) => {
    setLoading(true);
  
    if(data){
      return handleFetch({method: 'put', url: `/sewer/${User.user.id}`, body: values})
    }else{
      return handleFetch({method: 'post', url: `/sewer/add-sewer`, body: {
        ...values,
        userId: User.user.id}
      });
    }
  };

  //удаление профиля
  const onDelete = (e) => {
    e.preventDefault();
    setDeleteLoading(true);

    handleFetch({method: 'delete', url: `/sewer/${User.user.id}`})
      .catch(e => {
        console.log(e);

        setError('Произошла ошибка. Попробуйте еще раз')
      }).finally(() => {
        setDeleteLoading(false);
      })
  };

  //отправка формы
  const onSubmit = (values) => {
    submitFunc(values)
      .catch(e => {
        console.log(e);
        setError(`Ошибка. Попробуйте снова`)
      }).finally(() => {
        setLoading(false)
      })
  };

  return(
    <>
      <SalaryPopUp 
        active={modalActive} 
        setActive={setModalActive} 
      />

      <div>
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
          {!data ?
            <Input
              type='select'
              id='department-id'
              label='Выберите Отдел'
              options={options}
              error={errors?.departmentId && 'Поле обьязательно'}
              {...register('departmentId')}
            /> : 
            <div className={s.contentBody}>
              <div className={s.contentTable}>
                <div>
                  <div>Отдел:</div>
                  <div>{data.departmentName}</div>
                </div>
                <div>
                  <div>Кол-во:</div>
                  <div>{data.needAmount || "нету"}</div>
                </div>
                <div>
                  <div>Модель:</div>
                  <div>{data.clothesType || "нету"}</div>
                </div>
                <div>
                  <div>Цена(за 1шт):</div>
                  <div>{data.unitPrice || "нету"}</div>
                </div>
                <div>
                  <div>Статус:</div>
                  <div>{data.status}</div>
                </div>
              </div>
            </div>
          }
          <div className={s.formFooter}>
            <MyButton disabled={loading}>
              {loading ? 'Загрузка...' : 'Сохранить'}
            </MyButton>
            {data && <>
              <MyButton disabled={deleteLoading} onClick={onDelete}>
                {deleteLoading ? 'Загрузка...' : 'Удалить'}
              </MyButton>
              <MyButton onClick={() => setModalActive(true)}>Подсчет зарплаты</MyButton>
            </>}
          </div>
        </Form>
      </div>
    </>
  )
});