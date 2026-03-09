
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

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
        donations.forEach(d => {
            console.log(`${d._id} | ${d.title} | ${d.status} | ${d.createdAt}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkDonations();
