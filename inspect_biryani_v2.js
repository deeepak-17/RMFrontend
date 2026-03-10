import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: 'c:/Users/chand/Downloads/ResQMeals/backend/.env' });
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function inspect() {
    try {
        console.log("Using URI:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("Connected Successfully.");

        const DonationSchema = new mongoose.Schema({}, { strict: false, collection: 'fooddonations' });
        const TaskSchema = new mongoose.Schema({}, { strict: false, collection: 'pickuptasks' });

        const FoodDonation = mongoose.model('FoodDonation', DonationSchema);
        const PickupTask = mongoose.model('PickupTask', TaskSchema);

        const biryaniDonations = await FoodDonation.find({ title: { $regex: /biryani/i } });
        console.log(`Donations found: ${biryaniDonations.length}`);
        biryaniDonations.forEach(d => {
            console.log(`- ID: ${d._id}, Title: ${d.title}, Status: ${d.status}, CreatedAt: ${d.createdAt}`);
        });

        if (biryaniDonations.length > 0) {
            const donationIds = biryaniDonations.map(d => d._id);
            const tasks = await PickupTask.find({ donationId: { $in: donationIds } });
            console.log(`Related tasks: ${tasks.length}`);
            tasks.forEach(t => {
                console.log(`- Task ID: ${t._id}, DonationID: ${t.donationId}, VolunteerID: ${t.volunteerId}, Status: ${t.status}`);
            });
        } else {
            console.log("No biryani donations found. Looking for ALL recent donations:");
            const allDonations = await FoodDonation.find().sort({ createdAt: -1 }).limit(5);
            allDonations.forEach(d => {
                console.log(`- ID: ${d._id}, Title: ${d.title}, Status: ${d.status}, CreatedAt: ${d.createdAt}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}
inspect();
