import { IEffectFn } from './effect';

export const jobQueue = new Set<IEffectFn>();
const p = Promise.resolve();

let isFlushing = false;
export function flushJob() {
  if (isFlushing) {
    return;
  }
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  });
}

export const schedule = (fn: IEffectFn) => {
  jobQueue.add(fn);
  flushJob();
}