
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../ResQMeals/backend/.env') });
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const FoodDonationSchema = new mongoose.Schema({
    title: String,
    status: String,
    createdAt: Date,
    donorId: mongoose.Schema.Types.ObjectId,
});

async function checkDonations() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', FoodDonationSchema);
        const donations = await FoodDonation.find({}).sort({ createdAt: -1 }).limit(5);
        console.log("Latest 5 donations:");
        console.log(JSON.stringify(donations, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkDonations();
