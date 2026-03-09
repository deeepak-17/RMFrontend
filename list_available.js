
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function listAvailable() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String, status: String, createdAt: Date }));
        const donations = await FoodDonation.find({ status: "available" }).sort({ createdAt: -1 });
        console.log(`Found ${donations.length} available donations:`);
        donations.forEach(d => {
            console.log(`- ${d.title} (${d.createdAt})`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listAvailable();
