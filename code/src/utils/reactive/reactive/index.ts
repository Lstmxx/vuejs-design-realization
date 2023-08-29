import { activeEffect, effect, IEffectFn } from './effect';
import { jobQueue, flushJob } from './scheduler';

const bucket = new WeakMap<any, Map<any, Set<IEffectFn>>>();


const track = (target: any, key: any) => {
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

const trigger = (target: any, key: any) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  console.log("effects", effects);
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

const data = { text: "hello world", ok: true, count: 0 };
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newValue) {
    target[key] = newValue;
    trigger(target, key);
    return true;
  }
});

const computed = (getter: Function) => {
  const effectFn = effect(getter, { lazy: true });
  const obj = {
    get value() {
      return effectFn();
    }
  };
  return obj;
};

const 

export default function run() {
  effect(() => {
    // document.body.innerText = obj.ok ? obj.text : 'not';
    // obj.count++;
    console.log(obj.count);
  }, {
    scheduler: (fn: IEffectFn) => {
      jobQueue.add(fn);
      flushJob();
    }
  });

  obj.count++;
  obj.count++;
  console.log('end');
  // setTimeout(() => {
  //   obj.text = "hsdgsg";
  // }, 2000);
  // setTimeout(() => {
  //   obj.ok = false;
  // }, 3000);
  // setTimeout(() => {
  //   obj.text = "false";
  // }, 3000);
}
