import { asyncComponent } from 'utils/asyncComponent'
import CategoryTabsClient from './SidebarMenu.client'

const fetchCategories = async () => {
  return [{ title: 'fishing-activity' }, { title: 'marine-manager' }]
}

const SidebarMenu = asyncComponent(async () => {
  const categories = await fetchCategories()
  return <CategoryTabsClient categories={categories} />
})

export default SidebarMenu
