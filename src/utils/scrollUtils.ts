/**
 * Smoothly scrolls to the specified element
 * @param elementId The ID of the element to scroll to
 * @param offset Optional vertical offset in pixels
 * @param duration Duration of the scroll animation in milliseconds
 */
export const scrollToElement = (elementId: string, offset = 0, duration = 1000): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutCubic = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * easeInOutCubic);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

/**
 * Handles scroll event to check visibility of elements
 * @param callback Function to call with visibility data
 * @param threshold Visibility threshold (0 to 1)
 */
export const createScrollObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  threshold = 0.1
): IntersectionObserver => {
  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold
  });
  
  return observer;
}; 