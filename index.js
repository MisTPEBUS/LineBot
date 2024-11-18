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

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const replyMessage = {
        type: 'text',
        text: `你說了: ${event.message.text}`,
    };

    return client.replyMessage(event.replyToken, replyMessage);
}

const client = new line.Client(config);

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
