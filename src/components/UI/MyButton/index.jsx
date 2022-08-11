import s from './style.module.sass';

export default function MyButton({children, ...props}){
  return(
    <button {...props} className={s.myButton}>{children}</button>
  )
}