export function debounce(fn, delay) {
  var timer = null; // 2️⃣ Closures
  return function () {
    // 3️⃣ context (this)
    var context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args); // 1️⃣ Callback function
    }, delay);
  };
}
