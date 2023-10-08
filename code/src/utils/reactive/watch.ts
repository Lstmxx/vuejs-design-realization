import { effect } from "vue";

function traverse(value: Object, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  
  seen.add(value);

  //object的情况
  for (const key in value) {
    traverse((value as any)[key], seen);
  }

  return value;
}

type Option = {
  immediate?: boolean;
  // 调度顺序
  flush?: 'post' | 'pre' | 'sync',
}

export function watch(source: Function | Object, cb: (newValue: any, oldValue: any, cleanup: Function) => void, option: Option) {
  let getter: Function;

  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  let oldValue: any, newValue: any;
  let cleanup: Function;

  function onInvalidate(fn: Function) {
    cleanup = fn;
  }
  const job = () => {
    newValue = fn();
    cleanup && cleanup();
    cb(newValue, oldValue, onInvalidate);
    // 更新旧值
    oldValue = newValue;
  };
  const fn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler: () => {
        if (option.flush === 'post') {
          const p = Promise.resolve();
          p.then(job);
        } else {
          job();
        }
      },
    },
  );

  // 立即执行
  if (option.immediate) {
    job();
  } else {
    oldValue = fn();
  }
};
