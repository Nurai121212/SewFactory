import s from './style.module.sass';
import classNames from 'classnames';

export default function PopUp({active, setActive, children}){
  return(
    <div className={classNames(s.modal, {[s.active] : active})} onClick={() => setActive(false)}>
      <div className={classNames(s.modalContent, {[s.active] : active})} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setActive(false)}
          className={s.closeBtn}>
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  )
}