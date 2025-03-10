const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define transaction schema
const transactionSchema = new mongoose.Schema({
    userId: Number,
    sender: String,
    receiver: String,
    amount: String,
    txHash: String,
    timestamp: { type: Date, default: Date.now },
});

// Create model
const Transaction = mongoose.model("Transaction", transactionSchema);

// Function to store transaction in MongoDB
async function saveTransaction(userId, sender, receiver, amount, txHash) {
    try {
        const transaction = new Transaction({ userId, sender, receiver, amount, txHash });
        await transaction.save();
        console.log("✅ Transaction saved to MongoDB");
    } catch (error) {
        console.error("❌ Error saving transaction:", error);
    }
}

async function fetchUserHistory(userId) {
    return await Transaction.find({ userId }).sort({ timestamp: -1 }).limit(10);
}

module.exports = { saveTransaction, fetchUserHistory };
