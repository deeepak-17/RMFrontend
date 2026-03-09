import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to find .env in backend dir
dotenv.config({ path: 'c:/Users/chand/Downloads/ResQMeals/backend/.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function inspect() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const DonationSchema = new mongoose.Schema({
            title: String,
            status: String,
            donorId: mongoose.Schema.Types.ObjectId,
            location: {
                type: { type: String, default: "Point" },
                coordinates: [Number],
                address: String
            },
            expiryTime: Date
        }, { collection: 'fooddonations' });

        const TaskSchema = new mongoose.Schema({
            donationId: mongoose.Schema.Types.ObjectId,
            volunteerId: mongoose.Schema.Types.ObjectId,
            status: String,
            ngoId: mongoose.Schema.Types.ObjectId,
        }, { collection: 'pickuptasks' });

        const FoodDonation = mongoose.model('FoodDonation', DonationSchema);
        const PickupTask = mongoose.model('PickupTask', TaskSchema);

        console.log("\n--- Searching for 'fish biryani' ---");
        const biryaniDonations = await FoodDonation.find({ title: /fish biryani/i });
        console.log(`Found ${biryaniDonations.length} donations matching 'fish biryani'`);
        console.log(JSON.stringify(biryaniDonations, null, 2));

        if (biryaniDonations.length > 0) {
            const donationIds = biryaniDonations.map(d => d._id);
            console.log("\n--- Searching for tasks related to these donations ---");
            const relatedTasks = await PickupTask.find({ donationId: { $in: donationIds } });
            console.log(`Found ${relatedTasks.length} tasks related to these donations`);
            console.log(JSON.stringify(relatedTasks, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
inspect();
