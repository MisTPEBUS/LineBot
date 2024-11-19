const line = require('@line/bot-sdk');
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const config = {
    channelAccessToken: 'gapbL9VVWnPy8b16qW87bwkxfy8tZpLzjtSXdaHA3KPYsUKRih4ogT1nnvV8K3Uog1dyuk2ErkIIfst2fn2POxA4W9ea8aNr5HXQ4/bB6duYqRvcSssNcNkinIZwuro5QuHNEsthIHTu/lucdai69wdB04t89/1O/w1cDnyilFU=',  // 替換為您的 Channel Access Token
    channelSecret: '8fdb0ab09de87d92e4ff68257983caba',            // 替換為您的 Channel Secret
};

const app = express();
const session = require('express-session');
app.use(session({ secret: 'a0b71be06ffdb0a5edab1a54707f5751', resave: true, saveUninitialized: true }));
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

app.post('/send-msg', (req, res) => {
    const { to, msg } = req.body;
    console.log('req.body', req)
    console.log('to:', to);
    console.log('msg:', msg);
    if (!to || !msg) {
        return res.status(400).send('缺少 to 或 msg 欄位');
    }
    res.status(200).json(req.body);
    client.pushMessage(to, {
        type: 'text',
        text: msg,
    })
        .then(() => {
            res.status(200).send('訊息發送成功');
        })
        .catch((err) => {
            console.error('發送訊息失敗:', err);
            res.status(500).send('訊息發送失敗');
        });
});

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type === 'join') {
        // 當 Bot 加入群組時，LINE 會發送一個 join 事件
        const groupId = event.source.groupId;
        console.log(`Bot 被邀請加入群組，群組 ID 為: ${groupId}`);

        // 您可以將 groupId 儲存起來以供日後使用
        return client.pushMessage(groupId, {
            type: 'text',
            text: '大家好！我是BOT！我最棒!',
        });
    }
    if (event.type === 'message' && event.message.type === 'text') {
        if (event.source.type === 'group') {
            const groupId = event.source.groupId;
            console.log(`收到群組訊息，群組 ID 為: ${groupId}`);

            // 這裡可以讓 Bot 回應群組 ID
            const replyMessage = {
                type: 'text',
                text: `這個群組的 ID 是: ${groupId}`,
            };

            //  return client.replyMessage(event.replyToken, replyMessage);
        }
    }

    return Promise.resolve(null);
}

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});