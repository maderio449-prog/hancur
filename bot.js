// bot_kirim20.js
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// GANTI dengan token dan key kamu atau export ke env
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8499584477:AAEwTvcdjckwU_vHJ6C2dgUUfqoiKbmUFNQ';
const FONNTE_KEY = process.env.FONNTE_KEY || 'ctKBo8JdYJ3XqxPBD6Fg';

if (!TELEGRAM_TOKEN || !FONNTE_KEY) {
  console.error('Set TELEGRAM_TOKEN dan FONNTE_KEY di environment atau di file.');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

function make20Lines(text = ' ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ') {
  return Array.from({ length: 150 }).map(() => text).join('\n');
}

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();

    if (text === '.menu') {
      return bot.sendMessage(chatId, 'send no and menu\nFormat: .kirim20 628xx');
    }

    if (text.startsWith('.kirim20 ')) {
      const target = text.split(/\s+/)[1];
      if (!target) return bot.sendMessage(chatId, 'Format salah. Contoh: .kirim20 6281234567890');

      // Buat 1 pesan yang berisi 20 baris "Halo"
      const message = make20Lines(' ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ ꦽ');

      try {
        const res = await axios.post('https://api.fonnte.com/send',
          { target: target.trim(), message },
          { headers: { Authorization: FONNTE_KEY } , timeout: 200000}
        );
        // kirimkan respons ke Telegram agar pengguna tahu status
        return bot.sendMessage(chatId, `Response Fonnte: ${JSON.stringify(res.data)}`);
      } catch (err) {
        console.error('Fonnte error:', err?.response?.data || err.message);
        return bot.sendMessage(chatId, '❌ Gagal kirim ke Fonnte. Cek API key / koneksi.');
      }
    }
  } catch (e) {
    console.error('Handler error', e);
  }
});
