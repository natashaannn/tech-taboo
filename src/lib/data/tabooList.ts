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

// Export combined list of all categories
export const tabooList = [
  ...generalTabooList,
  ...aiTabooList,
  ...softwareEngineeringTabooList,
  ...dataTabooList,
  ...productManagementTabooList,
  ...dsaTabooList,
  ...systemDesignTabooList,
  ...gameDevTabooList,
  ...devopsTabooList,
  ...cybersecurityTabooList,
  ...uxDesignTabooList,
  ...responsibleTechTabooList
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
