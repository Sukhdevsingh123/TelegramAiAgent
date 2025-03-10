

require("dotenv").config();
const { saveTransaction, fetchUserHistory } = require("./models/database");
const { Telegraf, Markup } = require("telegraf");
const { ethers } = require("ethers");
const OpenAI = require("openai");

const BOT_TOKEN = process.env.BOT_TOKEN;
const SONIC_RPC_URL = process.env.SONIC_RPC_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const bot = new Telegraf(BOT_TOKEN);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const provider = new ethers.JsonRpcProvider(SONIC_RPC_URL);

let userWallets = {};
let userSigners = {};
let awaitingPrivateKey = {};



bot.telegram.sendPhoto(
    process.env.ADMIN_ID,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiz0GagK6beE_7TjzvZ2cdfCmg66_nFJ3rIA&s",
    {
        caption: `🚀 <b><u><i>WELCOME TO SONIC AI BLOCKCHAIN ASSISTANT!</i></u></b>\n\n` +
            `🤖 <b>I'm Sonic AI</b>, your personal blockchain assistant! Here's what I can do:\n\n` +
            `🔹 <b>Track & Manage Transactions</b>\n` +
            `🔹 <b>Answer Blockchain-Related Queries</b>\n` +
            `🔹 <b>Send & Receive Money Instantly</b>\n` +
            `🔹 <b>Show Your Wallet Balance</b>\n` +
            `🔹 <b>Securely Store & Retrieve Your Data</b>\n\n` +
            `💡 <b>Before using me, send <code>/start</code> in this chat.</b>\n\n` +
            `🚀 <u>Once you've sent /start, click the button below to begin:</u>`,
        parse_mode: "HTML",
       
    }
);


bot.action("start", async (ctx) => {
    await ctx.answerCbQuery(); // Acknowledge button press
    bot.start(ctx); // Manually trigger the start function
});

bot.start((ctx) => {
    ctx.reply(
        "🤖 **WELCOME TO SONIC AI BLOCKCHAIN ASSISTANT!!**\n\n" +
        "🚀 **Features:**\n" +
        "1️⃣ Connect Wallet\n" +
        "2️⃣ Check Balance\n" +
        "3️⃣ Send Money\n" +
        "4️⃣ Show My Previous History\n" +
        "5️⃣ Show My Current Network\n" +
        "6️⃣ Ask Blockchain Questions\n\n" +
        "Click below to connect:",
        Markup.inlineKeyboard([
            [Markup.button.callback("🔗 Connect Wallet", "connect_wallet")],
        ])
    );
});

bot.action("connect_wallet", (ctx) => {
    ctx.reply(
        "Choose a connection method:",
        Markup.inlineKeyboard([
            [Markup.button.callback("🦊 MetaMask", "connect_metamask")],
            [Markup.button.callback("🔑 Private Key", "connect_private")],
            [Markup.button.callback("🏦 Wallet Address", "connect_address")],
        ])
    );
});

bot.action("connect_metamask", async (ctx) => {
    const deepLink = "https://metamask.app.link/dapp/dapp.example.com";
    ctx.reply(
        "🦊 Click the button below to connect MetaMask.\n" +
        "📲 If you're on mobile, ensure MetaMask is installed.",
        Markup.inlineKeyboard([
            [Markup.button.url("🔗 Connect with MetaMask", deepLink)]
        ])
    );
});

bot.action("connect_private", (ctx) => {
    const userId = ctx.from.id;
    awaitingPrivateKey[userId] = true;
    ctx.reply("🔑 Please send your private key to connect your wallet.");
});

bot.on("text", async (ctx) => {
    const userId = ctx.from.id;
    let text = ctx.message.text.trim().toLowerCase();

    if (awaitingPrivateKey[userId]) {
        delete awaitingPrivateKey[userId];
        try {
            const signer = new ethers.Wallet(ctx.message.text, provider);
            userWallets[userId] = await signer.getAddress();
            userSigners[userId] = signer;

            ctx.reply(`✅ **Connected!**\nYour Address: \`${userWallets[userId]}\``, { parse_mode: "Markdown" });
            ctx.reply("What would you like to do next?", Markup.inlineKeyboard([
                [Markup.button.callback("💰 Check Balance", "check_balance")],
                [Markup.button.callback("💸 Send Money", "send_money")],
            ]));
        } catch (error) {
            ctx.reply("❌ Invalid private key. Please try again.");
        }
        return;
    }

    if (text.startsWith("0x") && text.length === 42) {
        userWallets[userId] = text;
        ctx.reply(`✅ Wallet connected!\nYour Address: \`${text}\``, { parse_mode: "Markdown" });
        ctx.reply("What would you like to do next?", Markup.inlineKeyboard([
            [Markup.button.callback("💰 Check Balance", "check_balance")],
            [Markup.button.callback("💸 Send Money", "send_money")],
        ]));
        return;
    }

    if (text.startsWith("send ")) {
        const parts = text.split(" ");
        if (parts.length !== 3) {
            ctx.reply("❌ Format: send <amount> <receiver_address>");
            return;
        }

        const amount = parts[1];
        const receiver = parts[2];

        if (!ethers.isAddress(receiver)) {
            ctx.reply("❌ Invalid address.");
            return;
        }

        if (!userSigners[userId]) {
            ctx.reply("❌ Connect via private key to send transactions.");
            return;
        }

        try {
            const signer = userSigners[userId];
            const sender = await signer.getAddress();

            const tx = await signer.sendTransaction({
                to: receiver,
                value: ethers.parseEther(amount),
            });

            ctx.reply(`✅ Sent! Tx Hash: ${tx.hash}`, Markup.inlineKeyboard([
                [Markup.button.url("🔍 View Transaction", `https://testnet.sonicscan.org/tx/${tx.hash}`)],
            ]));

            await saveTransaction(userId, sender, receiver, amount, tx.hash);
        } catch (error) {
            ctx.reply(`❌ Failed: ${error.message}`);
        }
        return;
    }

    if (text === "show my previous history") {
        const history = await fetchUserHistory(userId);
        if (!history || history.length === 0) {
            ctx.reply("📜 No transaction history found.");
        } else {
            let historyMessage = "📜 **Your Transaction History:**\n\n";
            history.forEach((tx, index) => {
                historyMessage += `🔹 **Tx ${index + 1}**\n`;
                historyMessage += `📍 **From:** ${tx.sender}\n`;
                historyMessage += `📍 **To:** ${tx.receiver}\n`;
                historyMessage += `💰 **Amount:** ${tx.amount} S\n`;
                historyMessage += `🔗 [View Transaction](https://testnet.sonicscan.org/tx/${tx.txHash})\n\n`;
            });
            ctx.reply(historyMessage, { parse_mode: "Markdown" });
        }
        return;
    }

    if (text.includes("network") || text.includes("current network")) {
        try {
            const network = await provider.getNetwork();
            ctx.reply(`🌐 **Connected Network:** Sonic blaza (Chain ID: ${network.chainId})`);
        } catch (error) {
            ctx.reply("❌ Unable to fetch network details.");
        }
        return;
    }

    if (text.includes("wallet") || text.includes("balance")) {
        if (userWallets[userId]) {
            try {
                const balance = await provider.getBalance(userWallets[userId]);
                const formattedBalance = ethers.formatEther(balance);
                ctx.reply(`💰 **Wallet Info:**\n📍 Address: \`${userWallets[userId]}\`\n💰 Balance: ${formattedBalance} Sonic`, { parse_mode: "Markdown" });
            } catch (error) {
                ctx.reply("❌ Error fetching balance.");
            }
        } else {
            ctx.reply("❌ Connect your wallet first.");
        }
        return;
    }

    ctx.reply("🤖 Processing...");
    try {
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an AI expert in blockchain and cryptocurrency. Provide short, accurate answers." },
                { role: "user", content: text }
            ],
        });

        ctx.reply(`💡 Sonic AI: ${aiResponse.choices[0].message.content}`);
    } catch (error) {
        ctx.reply("❌ Sonic AI: Unable to process request.");
    }
});

bot.action("check_balance", async (ctx) => {
    const userId = ctx.from.id;
    if (!userWallets[userId]) {
        ctx.reply("❌ Connect a wallet first.");
        return;
    }

    try {
        const balance = await provider.getBalance(userWallets[userId]);
        const formattedBalance = ethers.formatEther(balance);
        ctx.reply(`💰 **Your Balance:** ${formattedBalance} Sonic`);
    } catch (error) {
        ctx.reply(`❌ Error fetching balance: ${error.message}`);
    }
});

bot.action("send_money", (ctx) => {
    ctx.reply("💸 Format: send <amount> <receiver_address>");
});

bot.launch();
console.log("🤖 Telegram AI Bot Started...");

