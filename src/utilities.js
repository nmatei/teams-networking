export function $(selector) {
  return document.querySelector(selector);
}

export function debounce(fn, ms) {
  var timeout;
  return function () {
    //console.warn("inside fn", ms);

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
}
