import styles from './style.module.sass'

function Footer(){
  return(
    <div className={styles.footer}>
      <div className={styles.footerContainer}>
        <span>
          © {new Date().getFullYear()} All rights reserved
        </span>
        <ul>
          <li>
            <a href="mailto:admin@gmail.com">Написать</a>
          </li>
          <li>
            <a href="tel:+996552023155">Позвонить</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Footer