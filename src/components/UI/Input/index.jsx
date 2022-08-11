import React from "react";
import s from  './style.module.sass';

export const Input = React.forwardRef((
  {error, 
    nameGroup, 
    value, 
    id, 
    label, 
    options,
    disabled, 
    type ='text', 
    ...rest}, ref) => {
    switch(type){
      case 'radio':
        return(
          <div className={s.radioInput}>
             <label htmlFor={id}>{label}</label>
             <input 
               id={id} 
               type={type} 
               ref={ref} 
               value={value} 
               name={nameGroup} 
               {...rest} 
             />
          </div>)
      case 'select' :
        return(
          <div className={s.selectContainer}>
            <label htmlFor={id}>{label}</label>
            <select name={nameGroup} id={id} ref={ref} {...rest}>
              <option value="">Все</option>
              {options.map(item => {
                return(
                  <option value={item.id} key={item.id}>
                    {item.departmentName}
                  </option>
                )
              })}
            </select>
            {error && (<span>{error}</span>)}
          </div>)
      default:
        return(
          <div className={s.myInput}>
            <label htmlFor={id}>{label}</label>
            <input 
             id={id} 
             type={type} 
             ref={ref} 
             disabled={disabled}
             {...rest}/>
            {error && (<span>{error}</span>)}
          </div>)
    }
})