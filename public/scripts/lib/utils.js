// public/scripts/lib/utils.js
import { saveSVG, saveSVGsAsZip, savePNGFromSVG, savePNGsAsZip } from './exporters.js';

// Save PNG(s) from a container that holds one or more <svg> nodes
// Matches the behavior used in public/scripts/main.js
export async function savePngsFromContainer(containerSelector, singleFilename = 'card.png', zipFilename = 'cards-png.zip', width = 580, height = 890) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    alert('Nothing to export. Container not found.');
    return;
  }
  const svgs = Array.from(container.querySelectorAll('svg'));
  if (svgs.length <= 1) {
    const svgMarkup = svgs.length === 1 ? svgs[0].outerHTML : container.innerHTML;
    savePNGFromSVG(svgMarkup, singleFilename, width, height);
  } else {
    const items = svgs.map((el, i) => ({ name: `card-${i + 1}.svg`, markup: el.outerHTML }));
    await savePNGsAsZip(items, zipFilename, width, height);
  }
}

// Save SVG(s) from a container that holds one or more <svg> nodes
export async function saveSvgsFromContainer(containerSelector, singleFilename = 'card.svg', zipFilename = 'cards-svg.zip') {
  const container = document.querySelector(containerSelector);
  if (!container) {
    alert('Nothing to export. Container not found.');
    return;
  }
  const svgs = Array.from(container.querySelectorAll('svg'));
  if (svgs.length <= 1) {
    const svgMarkup = svgs.length === 1 ? svgs[0].outerHTML : container.innerHTML;
    saveSVG(svgMarkup, singleFilename);
  } else {
    const items = svgs.map((el, i) => ({ name: `card-${i + 1}.svg`, markup: el.outerHTML }));
    await saveSVGsAsZip(items, zipFilename);
  }
}
