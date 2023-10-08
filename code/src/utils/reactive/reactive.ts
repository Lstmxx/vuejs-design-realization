import { activeEffect, IEffectFn } from './effect';

const bucket = new WeakMap<any, Map<any, Set<IEffectFn>>>();

export const track = (target: any, key: any) => {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
};

export const trigger = (target: any, key: any) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set<IEffectFn>();
  if (effects) {
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  }
  effectsToRun.forEach((fn) => {
    const { options } = fn;
    if (options && options.scheduler) {
      options.scheduler(fn);
    } else {
      fn();
    }
  });
};