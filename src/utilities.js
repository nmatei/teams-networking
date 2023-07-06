export function $(selector) {
  return document.querySelector(selector);
}

export function mask(el) {
  el.classList.add("loading-mask");
  //$("#teamsForm").classList.add("loading-mask");
}

export function unmask(el) {
  el.classList.remove("loading-mask");
}

export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

(async () => {
  console.info("1. start sleeping...");
  await sleep(2000);
  console.warn("2. ready to do %o", "next job");
})();
