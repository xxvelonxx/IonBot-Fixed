import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from './core/router.js';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('IonBot is running...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const response = await handleMessage({ text });
    bot.sendMessage(chatId, response);
  } catch (error) {
    console.error('Error handling message:', error);
    bot.sendMessage(chatId, 'Sorry, I encountered an error processing your request.');
  }
});
