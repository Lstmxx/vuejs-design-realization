interface Options {
  scheduler?: (...args: any) => void;
  lazy?: boolean;
}

export interface IEffectFn extends Function {
  deps: Set<any>[];
  options?: Options;
}

export let activeEffect: IEffectFn;

const effectStack: IEffectFn[] = [];

const cleanup = (fn: IEffectFn) => {
  for (let i = 0; i < fn.deps.length; i++) {
    const deps = fn.deps[i];
    deps.delete(fn);
  }
  fn.deps = [];
}

export const effect = (fn: Function, options?: Options = {}) => {
  const effectFn: IEffectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    console.log(activeEffect.deps);
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (options && options.lazy) {
    return effectFn;
  } else {
    effectFn()
  }
}