# 🚀 Sonic Blaza AI-Powered Telegram AI Agent

## 📌 Project Overview
The **Sonic Blaza AI-Powered Telegram AI Agent** is an advanced blockchain AI agent that interacts with the **Sonic Chain**. It provides real-time blockchain insights, executes smart contract queries, and leverages AI for intelligent responses.

This AI Agent integrates:
- **Sonic Blaza Smart Contracts** to fetch blockchain data.
- **Alchemy API** for gas fee tracking.
- **The Graph API** for querying on-chain data.
- **OpenAI API** to power AI-driven responses.
- **MongoDB** to cache responses and optimize performance.
- **Telegram Bot API** to provide a seamless user experience.
- **🔗 Telegram Live Agent** [Sonic Blaza AI Agent](https://web.telegram.org/k/#@sukhdevAi_bot)

---

## 📡 Technologies Used

| Technology | Purpose |
|------------|---------|
| **Node.js** | Backend runtime for the AI Agent |
| **Telegraf.js** | Framework for Telegram AI agent development |
| **MongoDB** | Database for caching blockchain queries |
| **Sonic Blaza** | Blockchain network for contract execution |
| **Smart Contracts (Sonic Chain)** | Fetching wallet balances, transactions, staking rewards, and token prices |
| **The Graph API** | Querying real-time blockchain data |
| **Alchemy API** | Fetching gas fees |
| **OpenAI API** | AI-generated responses for blockchain-related queries |
| **IPFS/Arweave** | Storing decentralized AI reports |
| **dotenv** | Managing environment variables securely |

---

## 🔑 Environment Variables (.env)

To run the project, configure the `.env` file with the following variables:

```plaintext
BOT_TOKEN=<Your_Telegram_Bot_Token>
OPENAI_API_KEY=<Your_OpenAI_API_Key>
MONGO_URI=<Your_MongoDB_Connection_String>
GRAPH_API=<Your_Sonic_Blaza_Graph_API_Endpoint>
ALCHEMY_API_KEY=<Your_Alchemy_API_Key>
SONIC_CONTRACT_ADDRESS=<Your_Sonic_Contract_Address>
```

**Where to get these:**
- **BOT_TOKEN** → Get from [@BotFather](https://t.me/botfather) on Telegram.
- **OPENAI_API_KEY** → Get from [OpenAI API](https://platform.openai.com/).
- **MONGO_URI** → Your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **GRAPH_API** → Get from [The Graph Explorer](https://thegraph.com/explorer) (Look for Sonic Blaza’s subgraph or deploy your own).
- **ALCHEMY_API_KEY** → Get from [Alchemy](https://www.alchemy.com/).
- **SONIC_CONTRACT_ADDRESS** → Get the contract address from SonicScan.

---

## ⚙️ Features & Functionalities

### ✅ **AI-Powered Blockchain Querying**
- Ask AI about **wallet balances, token transactions, staking rewards, and gas fees**.
- AI can answer **general crypto and DeFi questions**.
- Uses **OpenAI GPT-4** for intelligent responses.

### ✅ **Sonic Blaza Smart Contract Integration**
- Fetches **top 3 wallet holders** of Sonic tokens.
- Queries **staking rewards** of any wallet.
- Tracks **real-time Sonic token prices**.
- Retrieves **gas fees using Alchemy API**.

### ✅ **Telegram AI Agent Commands**
- `/start` → Start the AI agent and view instructions.
- `What are the top 3 wallets holding Sonic tokens?` → Fetches top wallet holders.
- `What is my wallet address?` → AI explains how to find your wallet address.
- `What is the gas fee now?` → Retrieves latest gas fees.
- `What is the Sonic token price?` → Fetches real-time token price.
- Any other question → AI responds using OpenAI.

### ✅ **Optimized Caching with MongoDB**
- Frequently asked questions are cached for **24 hours** to reduce API calls.
- Cached responses include **wallet balances, staking rewards, and token prices**.

### ✅ **Decentralized Data Storage**
- Stores **AI-generated reports** on **IPFS/Arweave** for decentralized access.

---

## 🚀 Deployment

### 1️⃣ **Run Locally**

```bash
git clone https://github.com/yourrepo/sonic-blaza-ai-agent.git
cd sonic-blaza-ai-agent
npm install
node bot.js
```

### 2️⃣ **Deploy on a Cloud Server (Railway/Heroku/VPS)**

```bash
git push heroku main
# or
railway up
```

### 3️⃣ **Deploy on Telegram Cloud AI Agent**
- Follow Telegram’s **Bot Deployment Guide**.
- Use **Telegram’s official hosting** for free AI agent hosting.
- Join **[Deployment Channel](https://t.me/your_deployment_channel)** for updates.

---

## 🔗 Live Link
[🚀 Try Sonic Blaza AI Agent on Telegram](https://web.telegram.org/k/#@sukhdevAi_bot)

---

## 📚 API References
- [OpenAI API](https://platform.openai.com/docs/)
- [Alchemy API](https://www.alchemy.com/)
- [The Graph API](https://thegraph.com/explorer)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Sonic Blaza Blockchain](https://sonicblaza.io/)
- [IPFS/Arweave Docs](https://docs.ipfs.io/)

---

## 🎯 Future Improvements
- ✅ Add **NFT tracking and analytics**.
- ✅ Implement **multi-chain support** for other blockchain networks.
- ✅ Train **custom AI models** using blockchain data.
- ✅ Improve **transaction tracking and alerts**.
- ✅ Enhance **security with private key management**.

---

## 🤝 Contributing
Want to improve this AI agent? Fork the repo and submit a PR! Feel free to open an issue for any bugs or feature requests.

