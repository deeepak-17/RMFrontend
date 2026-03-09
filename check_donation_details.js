
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const FoodDonationSchema = new mongoose.Schema({
    title: String,
    status: String,
    createdAt: Date,
    donorId: mongoose.Schema.Types.ObjectId,
    location: Object,
});

async function checkDonations() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', FoodDonationSchema);
        const donations = await FoodDonation.find({}).sort({ createdAt: -1 }).limit(1);
        if (donations.length > 0) {
            const d = donations[0];
            process.stdout.write(`ID: ${d._id}\n`);
            process.stdout.write(`Title: ${d.title}\n`);
            process.stdout.write(`Status: ${d.status}\n`);
            process.stdout.write(`Created: ${d.createdAt}\n`);
            process.stdout.write(`Location: ${JSON.stringify(d.location)}\n`);
        } else {
            process.stdout.write("No donations found.\n");
        }
        process.exit(0);
    } catch (err) {
        process.stderr.write(`${err}\n`);
        process.exit(1);
    }
}
checkDonations();
