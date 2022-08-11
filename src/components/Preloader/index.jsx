import s from './style.module.sass';
import preloader from '../../assets/imgs/preloader.gif'

export default function Preloader(){
  return(
    <div className={s.preloader}>
      <div className={s.loadImg}>
        <img src={preloader} alt="app-preloader"/>
      </div>
    </div>
  )
}