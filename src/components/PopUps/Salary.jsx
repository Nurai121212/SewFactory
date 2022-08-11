import handleFetch from "../../apiRequest";
import { useState, useEffect } from "react";
import Preloader from "../Preloader";
import PopUp from "../UI/PopUp";
import User from "../../store/User";

export default function SalaryPopUp({active, setActive}){
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  //запрос зарплаты
  useEffect(() => {
    if(active){
      setData(null)
      setLoading(true)
      
      handleFetch({method: 'get', url: `/sewer/count-salary/${User.user.id}`})
        .then(res =>{ 
          setData(res)
        }).catch(e => {
          console.log(e);
          setError('Не доступно')
        }).finally(()=>{
          setLoading(false);
        })
    }
  }, [active]);

  return(
    <>
      {loading ? <Preloader/> :
        <PopUp active={active} setActive={setActive}>
          <h1>Зарплата сотрудника :</h1>
          {error && <span>{error}</span>}
          {data && <h1>{data}</h1>}
        </PopUp>}
    </>
  )
}