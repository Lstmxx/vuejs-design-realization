import { track, trigger } from "./reactive";

export function createReactiveObject<T extends object>(target: T) {
  const proxy = new Proxy(target, {
    get(target, key) {
      track(target, key);
      const result = Reflect.get(target, key);
      return result;
    },
    set(target, key, newValue) {
      Reflect.set(target, key, newValue);
      trigger(target, key);
      return true;
    },
  });
  return proxy;
}
