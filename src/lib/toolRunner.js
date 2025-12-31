function waitForTool(name, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const interval = setInterval(() => {
      if (window.cryptoTools && typeof window.cryptoTools[name] === "function") {
        clearInterval(interval);
        resolve();
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error(`Tool '${name}' not available yet`));
      }
    }, 50);
  });
}

export async function runTool(name, payload) {
  await waitForTool(name);
  return await window.cryptoTools[name](payload);
}
