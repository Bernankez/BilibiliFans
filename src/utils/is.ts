export function isWebWorker() {
  return typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
}
