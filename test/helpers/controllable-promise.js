export function create() {
  let resolver;
  let rejecter;

  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  promise.resolve = (value) => resolver(value);
  promise.reject = (value) => rejecter(value);

  return promise;
}
