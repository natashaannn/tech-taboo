// Export all category lists
import { generalTabooList } from './general.js';
import { aiTabooList } from './ai.js';
import { softwareEngineeringTabooList } from './softwareEngineering.js';
import { productManagementTabooList } from './productManagement.js';
import { dataTabooList } from './data.js';
import { dsaTabooList } from './dsa.js';
import { systemDesignTabooList } from './systemDesign.js';
import { gameDevTabooList } from './gameDev.js';
import { devopsTabooList } from './devops.js';
import { cybersecurityTabooList } from './cybersecurity.js';
import { uxDesignTabooList } from './uxDesign.js';
import { responsibleTechTabooList } from './responsibleTech.js';

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
];

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
};
