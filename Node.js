// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/lottery_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义数据模型
const Prize = mongoose.model('Prize', {
  name: String,
  description: String,
  probability: Number,
  quantity: Number,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Winner = mongoose.model('Winner', {
  prizeId: mongoose.Schema.Types.ObjectId,
  prizeName: String,
  userName: String,
  phone: String,
  avatar: String,
  nickname: String,
  awardedAt: { type: Date, default: Date.now }
});

// 奖品管理API
app.get('/api/prizes', async (req, res) => {
  const prizes = await Prize.find().sort({ createdAt: -1 });
  res.json(prizes);
});

app.post('/api/prizes', async (req, res) => {
  const prize = new Prize(req.body);
  await prize.save();
  res.status(201).json(prize);
});

app.put('/api/prizes/:id', async (req, res) => {
  const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prize);
});

app.delete('/api/prizes/:id', async (req, res) => {
  await Prize.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// 中奖记录API
app.get('/api/winners', async (req, res) => {
  const winners = await Winner.find().populate('prizeId').sort({ awardedAt: -1 });
  res.json(winners);
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
