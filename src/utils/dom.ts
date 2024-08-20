export function checkVisibility(element: HTMLElement) {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility();
  }
  let e: HTMLElement | null = element;
  while (e) {
    // NOTE more conditions can be added
    if (window.getComputedStyle(e).display === "none") {
      return false;
    }
    e = e.parentElement;
  }
  return true;
}
