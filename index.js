const line = require('@line/bot-sdk');
const express = require('express');

const config = {
    channelAccessToken: 'gapbL9VVWnPy8b16qW87bwkxfy8tZpLzjtSXdaHA3KPYsUKRih4ogT1nnvV8K3Uog1dyuk2ErkIIfst2fn2POxA4W9ea8aNr5HXQ4/bB6duYqRvcSssNcNkinIZwuro5QuHNEsthIHTu/lucdai69wdB04t89/1O/w1cDnyilFU=',  // 替換為您的 Channel Access Token
    channelSecret: '8fdb0ab09de87d92e4ff68257983caba',            // 替換為您的 Channel Secret
};

const app = express();
app.use(line.middleware(config));

app.post('/send-message', (req, res) => {
    // 從請求中取得目標用戶 ID 和要發送的訊息
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).send('缺少 to 或 message 欄位');
    }

    // 設置推送訊息的內容
    const payload = {
        to: to,
        messages: [
            {
                type: 'text',
                text: message,
            },
        ],
    };

    // 使用 LINE SDK 發送推送訊息
    client.pushMessage(payload.to, payload.messages)
        .then(() => {
            res.status(200).send('訊息發送成功');
        })
        .catch((err) => {
            console.error('發送訊息失敗:', err);
            res.status(500).send('訊息發送失敗');
        });
});/* 
app.post('/webhook', (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
}); */

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const reply = {
        type: 'text',
        text: `我是Bot我最棒!GoLearning 收到你的訊息: ${event.message.text}`,
    };

    // 使用 replyToken 回應訊息
    return client.replyMessage(event.replyToken, reply);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});