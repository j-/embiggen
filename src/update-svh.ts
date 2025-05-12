function updateSVH() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--svh', `${height * 0.01}px`);
}

(window.visualViewport ?? window).addEventListener('resize', updateSVH);

updateSVH();
