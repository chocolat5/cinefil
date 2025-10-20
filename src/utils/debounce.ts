export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  const debouncedFn = (...args: T) => {
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
  debouncedFn.cancel = () => {
    clearTimeout(timeout);
  };

  return debouncedFn;
};
