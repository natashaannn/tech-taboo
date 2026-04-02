// Import all category files
import { generalTabooList } from './categories/general'
import { aiTabooList } from './categories/ai'
import { softwareEngineeringTabooList } from './categories/softwareEngineering'
import { productManagementTabooList } from './categories/productManagement'
import { dataTabooList } from './categories/data'
import { dsaTabooList } from './categories/dsa'
import { systemDesignTabooList } from './categories/systemDesign'
import { gameDevTabooList } from './categories/gameDev'
import { devopsTabooList } from './categories/devops'
import { cybersecurityTabooList } from './categories/cybersecurity'
import { uxDesignTabooList } from './categories/uxDesign'
import { responsibleTechTabooList } from './categories/responsibleTech'

// Add category to each word
const addCategory = (list: any[], category: string) => 
  list.map(item => ({ ...item, category }))

// Export combined list of all categories with category property
export const tabooList = [
  ...addCategory(generalTabooList, 'General'),
  ...addCategory(aiTabooList, 'AI'),
  ...addCategory(softwareEngineeringTabooList, 'Software Engineering'),
  ...addCategory(dataTabooList, 'Data'),
  ...addCategory(productManagementTabooList, 'Product Management'),
  ...addCategory(dsaTabooList, 'DSA'),
  ...addCategory(systemDesignTabooList, 'System Design'),
  ...addCategory(gameDevTabooList, 'Game Dev'),
  ...addCategory(devopsTabooList, 'DevOps'),
  ...addCategory(cybersecurityTabooList, 'Cybersecurity'),
  ...addCategory(uxDesignTabooList, 'UX Design'),
  ...addCategory(responsibleTechTabooList, 'Responsible Tech')
]

// Export individual category lists for custom deck creation
export {
  generalTabooList,
  aiTabooList,
  softwareEngineeringTabooList,
  dataTabooList,
  productManagementTabooList,
  dsaTabooList,
  systemDesignTabooList,
  gameDevTabooList,
  devopsTabooList,
  cybersecurityTabooList,
  uxDesignTabooList,
  responsibleTechTabooList
}
