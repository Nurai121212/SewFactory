import s from './style.module.sass';

export default function NotFound(){
  return(
    <div className={s.notFoundContainer}>
      <div></div>
      <h1>Ничего не нашлось. Поробуйте еще раз.</h1>
    </div>
  )
}