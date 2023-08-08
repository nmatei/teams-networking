export function $(selector) {
  return document.querySelector(selector);
}

export function mask(selector) {
  $(selector).classList.add("loading-mask");
}
export function unmask(selector) {
  $(selector).classList.remove("loading-mask");
}
