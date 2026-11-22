// 21456 ms → "21.4s", 83456 ms → "1m 23.4s"
export function formatTime(ms) {
  const tenths = Math.floor(ms / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = ((tenths % 600) / 10).toFixed(1);

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}
