// Minimal worker stub for future A* pathfinding
self.onmessage = (e: MessageEvent) => {
  const { cmd } = e.data || {};
  if (cmd === 'route') {
    // respond with a straight route stub
    (self as any).postMessage({ ok: true, path: [0, 1, 2, 3] });
  }
};
