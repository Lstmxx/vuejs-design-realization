const bucket = new Set<Function>();

let activeEffect: Function;

export function effect(fn: Function) {
  activeEffect = fn;
  return fn;
}

const data = { text: "hello world" };
const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[key];
  },
  set(target, key, newValue) {
    target[key] = newValue;
    console.log("set", newValue);
    bucket.forEach((fn) => fn());
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
