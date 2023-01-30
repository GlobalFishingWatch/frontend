import { useTranslation } from 'app/i18n/i18n'
import Link from 'next/link'

const Index = async function ({ params }) {
  const { t } = await useTranslation()
  return (
    <h1>
      {t('common.fishing', 'fallback')}
      Nested report for {params.category} in workspace: {params.workspace} for id: {params.id}
      <Link href="/marine-manager">Link to MM</Link>
    </h1>
  )
}

export default Index
