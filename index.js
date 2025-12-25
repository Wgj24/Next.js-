const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors()); // 允许所有来源


// 中间件
app.use(express.json());
app.use(express.static('public'));

// DeepSeek API 配置 (请替换为您的 API Key)
process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY = "sk-e9a9c9e0a5194a5e8262693a08dd58fc"
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY; // 从环境变量获取
console.log(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY); // 应输出密钥值
 // 从环境变量获取

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// API 路由
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: '消息内容不能为空' });
    }

    try {
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: "deepseek-chat",
            messages: [{ role: "user", content: userMessage }],
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content.trim();
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('调用DeepSeek API时出错:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'AI模型调用失败' });
    }
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});