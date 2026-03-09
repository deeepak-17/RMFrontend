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
        await mongoose.connect(MONGO_URI);
        const DonationSchema = new mongoose.Schema({}, { strict: false, collection: 'fooddonations' });
        const TaskSchema = new mongoose.Schema({}, { strict: false, collection: 'pickuptasks' });
        const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });

        const FoodDonation = mongoose.model('FoodDonation', DonationSchema);
        const PickupTask = mongoose.model('PickupTask', TaskSchema);
        const User = mongoose.model('User', UserSchema);

        const biryaniDonations = await FoodDonation.find({ title: { $regex: /biryani/i } });
        const donationIds = biryaniDonations.map(d => d._id);
        const tasks = await PickupTask.find({ donationId: { $in: donationIds } });

        const recentDonations = await FoodDonation.find().sort({ createdAt: -1 }).limit(3);

        const result = {
            biryaniCount: biryaniDonations.length,
            biryani: biryaniDonations.map(d => ({ id: d._id, title: d.title, status: d.status })),
            relatedTasks: tasks.map(t => ({ id: t._id, donationId: t.donationId, volunteerId: t.volunteerId, status: t.status })),
            recentDonations: recentDonations.map(d => ({ id: d._id, title: d.title, status: d.status, timestamp: d.createdAt }))
        };

        process.stdout.write(JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (err) {
        process.stderr.write(err.message);
        process.exit(1);
    }
}
inspect();
