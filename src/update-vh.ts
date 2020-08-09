/** See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ */
export const updateVH = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
window.addEventListener('resize', updateVH);
updateVH();
