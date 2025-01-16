import { Logo } from "@globalfishingwatch/ui-components"

import tmtLogo from '../../assets/images/tmt_logo_final_full_colour@2x.png'

import styles from './Partners.module.css'

const Partners: React.FC = () => {

    return (
        <div className={styles.partners}>
            <img src={tmtLogo.src} className={styles.tmtLogo} alt="Trygg Mat Tracking" />
            <Logo className={styles.gfwLogo} />
        </div>
    )
}

export default Partners