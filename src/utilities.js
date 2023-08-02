export function $(selector) {
  return document.querySelector(selector);
}

export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function mask(el) {
  el.classList.add("loading-mask");
}
export function unmask(el) {
  el.classList.remove("loading-mask");
}
