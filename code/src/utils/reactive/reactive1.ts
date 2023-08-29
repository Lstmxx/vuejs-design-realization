const bucket = new Set<Function>();

const data = { text: "hello world" };
const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },
  set(target, key, newValue) {
    target[key] = newValue;
    bucket.forEach((fn) => fn());
    return true;
  }
});

function effect() {
  document.body.innerText = obj.text;
}

effect();

export default function run() {
  setTimeout(() => (obj.text = "hello hhhhhhh"), 1000);
}
