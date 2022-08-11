import s from './style.module.sass';

export default function Error(){
  return(
    <div className={s.errorContainer}>
      <div></div>
      <h1>Ошибка. Поробуйте еще раз.</h1>
    </div>
  )
}