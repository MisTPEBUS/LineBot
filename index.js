const line = require('@line/bot-sdk');
const express = require('express');

const config = {
    channelAccessToken: 'gapbL9VVWnPy8b16qW87bwkxfy8tZpLzjtSXdaHA3KPYsUKRih4ogT1nnvV8K3Uog1dyuk2ErkIIfst2fn2POxA4W9ea8aNr5HXQ4/bB6duYqRvcSssNcNkinIZwuro5QuHNEsthIHTu/lucdai69wdB04t89/1O/w1cDnyilFU=',  // 替換為您的 Channel Access Token
    channelSecret: '8fdb0ab09de87d92e4ff68257983caba',            // 替換為您的 Channel Secret
};
const app = express();
app.use(line.middleware(config));

app.post('/webhook', (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
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
            text: '大家好！很高興加入這個群組！',
        });
    }

    return Promise.resolve(null);
}

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});