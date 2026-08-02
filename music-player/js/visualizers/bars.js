// ===============================
// 📊 BARS VISUALIZER
// ===============================

window.Visualizers.bars = function ({
  ctx,
  dataArray,
  bufferLength,
  canvas
}) {
  const barCount = 32;
  const freqStart = 2;
  const freqEnd = Math.min(90, bufferLength - 1);

  const usableRange = freqEnd - freqStart;
  const barWidth = canvas.width / barCount;

  let x = 0;

  for (let i = 0; i < barCount; i++) {
    const t = i / barCount;

    const logIndex =
      freqStart +
      Math.floor(usableRange * Math.pow(t, 1.5));

    const value = dataArray[logIndex] || 0;

    const maxBarHeight = canvas.height * 0.9;
    const barHeight = (value / 255) * maxBarHeight;

    ctx.shadowBlur = 24;

    ctx.fillRect(
      x,
      canvas.height - barHeight,
      barWidth - 1,
      barHeight
    );

    x += barWidth;
  }
};