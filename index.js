const express = require('express');
const line = require('@line/bot-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

const lineConfig = {
  channelSecret: 'b98a790d8d4a1fea981330f8d5820ffb',
  channelAccessToken: 'nEHbsMwELyhdwS8NwpnfX9lyMoyJR9AdtPyq42j0E7/TfMX6IDqfdQV6krtIaBpEs+PXlByXNU7AHcF0fCcBW5cAkag0Xw0Ej8eBVhtaKkof/Ci2ntvfqG5IBr3w3C/H/ybNFALgJytS8TTQe9+evAdB04t89/1O/w1cDnyilFU='
};

const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: lineConfig.channelAccessToken
});

const genAI = new GoogleGenerativeAI('AIzaSyAEPiHTNPzLnyBLxXO8z0La5tBYL9h5Uq8');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `คุณคือ AI Assistant ผู้ช่วยของร้านค้า
ตอบสั้นๆ กระชับ เป็นมิตร ใช้ภาษาไทย`;

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  res.json({ status: 'ok' });
  const events = req.body.events;
  for (const event of events) {