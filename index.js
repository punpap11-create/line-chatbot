const express = require('express');
const line = require('@line/bot-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

const lineConfig = {
  channelSecret: '2303e733c7b5b09c332ffc227c955c1d',
  channelAccessToken: '+JZavrFP57TCjFgIlhqa5L3FT6oUAED9R9W1XVt5JrHn4FV+IWnAvWTX25WyiNKPyMhFQpiwwNdsf9tjhyrQscniJ5+M2FS2itrnjr3tIatRalhEWn+wJ7+L6bgx1pckrlJiI+lpxx1y2Rhw6irpwQdB04t89/1O/w1cDnyilFU='
};

const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: lineConfig.channelAccessToken
});

const genAI = new GoogleGenerativeAI('AIzaSyB4OT7cWrxeIzUcdnowcfU7b_bcqfTBT5M');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const SYSTEM_PROMPT = `คุณคือ AI Assistant ผู้ช่วยของร้านค้า
ตอบสั้นๆ กระชับ เป็นมิตร ใช้ภาษาไทย`;

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  res.json({ status: 'ok' });
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      try {
        const result = await model.generateContent(
          SYSTEM_PROMPT + '\n\nลูกค้าถามว่า: ' + event.message.text
        );
        const reply = result.response.text();
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: reply }]
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));