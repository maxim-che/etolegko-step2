const url = process.argv[2];
const ITERATIONS = 10;

if (!url) {
  console.error('❌ Ошибка: укажите URL в качестве аргумента.');
  console.log('Пример запуска: node benchmark.js https://example.com');
  process.exit(1);
}

async function runBenchmark() {
  console.log(`🚀 Начинаем тест (${ITERATIONS} последовательных запросов) для:\n${url}\n`);

  let totalBytes = 0;
  let totalTimeMs = 0;

  for (let i = 1; i <= ITERATIONS; i++) {
    const start = performance.now();

    try {
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ошибка! Статус: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const end = performance.now();

      const durationMs = end - start;
      const bytes = buffer.byteLength;

      totalBytes += bytes;
      totalTimeMs += durationMs;

      console.log(
        `[${i}/${ITERATIONS}] Скачано: ${(bytes / 1024 / 1024).toFixed(2)} МБ | Время: ${durationMs.toFixed(0)} мс`
      );
    } catch (error) {
      console.error(`❌ Ошибка на запросе #${i}:`, error.message);
      process.exit(1);
    }
  }

  const avgTimeMs = totalTimeMs / ITERATIONS;
  const totalTimeSec = totalTimeMs / 1000;
  const totalMegabytes = totalBytes / (1024 * 1024);

  const speedMBps = totalMegabytes / totalTimeSec;
  const speedMbps = (totalBytes * 8) / (totalTimeSec * 1_000_000);

  console.log('\n--- 📊 Итоги ---');
  console.log(`Всего скачано:        ${totalMegabytes.toFixed(2)} МБ (${totalBytes} байт)`);
  console.log(`Общее время:          ${totalTimeSec.toFixed(2)} сек`);
  console.log(`Среднее время ответа: ${avgTimeMs.toFixed(0)} мс`);
  console.log(`Скорость скачивания:  ${speedMBps.toFixed(2)} МБ/с`);
}

runBenchmark();
