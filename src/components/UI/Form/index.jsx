import './style.module.sass';

export default function Form({children, ...props}){
  return(
    <form {...props}>
      {children}
    </form>
  )
}