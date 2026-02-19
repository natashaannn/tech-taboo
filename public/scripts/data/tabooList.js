// one deck has 54 cards
// NOTE: Make sure all lists are even numbers to prevent duplication of last odd numbered word in generation
// Variety Pack includes first N words of the following "General": 60, "AI": 16, "Software Engineering": 16, "Product Management": 16,

// Import all category files
import { generalTabooList } from './categories/general.js';
import { aiTabooList } from './categories/ai.js';
import { softwareEngineeringTabooList } from './categories/softwareEngineering.js';
import { productManagementTabooList } from './categories/productManagement.js';
import { dataTabooList } from './categories/data.js';
import { dsaTabooList } from './categories/dsa.js';
import { systemDesignTabooList } from './categories/systemDesign.js';
import { gameDevTabooList } from './categories/gameDev.js';
import { devopsTabooList } from './categories/devops.js';
import { cybersecurityTabooList } from './categories/cybersecurity.js';
import { uxDesignTabooList } from './categories/uxDesign.js';
import { responsibleTechTabooList } from './categories/responsibleTech.js';

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
