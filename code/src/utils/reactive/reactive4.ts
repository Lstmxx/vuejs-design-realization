const bucket = new WeakMap<any, Map<any, Set<Function>>>();

let activeEffect: Function;

export function effect(fn: Function) {
  activeEffect = fn;
  console.log("activeEffect", activeEffect);
  return fn;
}

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
};

const trigger = (target: any, key: any) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  console.log("effects", effects);
  if (effects) {
    effects.forEach((fn) => fn());
  }
};

const data = { text: "hello world" };
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newValue) {
    target[key] = newValue;
    console.log("set", newValue);
    trigger(target, key);
    return true;
  }
});

export default function run() {
  effect(() => {
    console.log("effect");
    document.body.innerText = obj.text;
  })();

  setTimeout(() => {
    obj.text = "hsdgsg";
  }, 2000);
  setTimeout(() => {
    (obj as any).notExist = "wtf";
  }, 3000);
}
