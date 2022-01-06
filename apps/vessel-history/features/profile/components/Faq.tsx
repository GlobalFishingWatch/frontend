import React, { useCallback, useMemo, useState } from 'react'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import styles from './Info.module.css'


interface FaqProps {
    source?: string
}
const Faq: React.FC<FaqProps> = ({
    source = '',
}): React.ReactElement => {
    const { t } = useTranslation()

    const trackClick = useCallback(() => {
        uaEvent({
            category: 'General VV features',
            action: 'User click on FAQ\'s',
            label: source,
        })
    }, [])
    return (
        <div>
            <a className={styles.faqButton} onClick={trackClick} target="_blank" href={t('common.faqLink', 'https://www.localized-link-to-faqs.com')} rel="noreferrer">
                {t('common.faq', 'FAQ\'s')}
            </a>
        </div>
    )
}

export default Faq
