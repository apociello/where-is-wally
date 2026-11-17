// 83456 ms → "1:23.4" (minutes:seconds.tenths)
export function formatTime(ms) {
  const tenths = Math.floor(ms / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor((tenths % 600) / 10);

  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths % 10}`;
}
