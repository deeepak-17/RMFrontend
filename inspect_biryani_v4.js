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

        const biryaniDonations = await FoodDonation.find({ title: { $regex: /biryani/i } }).sort({ createdAt: -1 });

        const results = [];
        for (const d of biryaniDonations) {
            const task = await PickupTask.findOne({ donationId: d._id }).sort({ createdAt: -1 });
            let volunteer = null;
            if (task && task.volunteerId) {
                volunteer = await User.findById(task.volunteerId);
            }
            results.push({
                donation: { id: d._id, title: d.title, status: d.status, location: d.location },
                task: task ? { id: task._id, status: task.status, volunteerId: task.volunteerId } : null,
                volunteer: volunteer ? { id: volunteer._id, name: volunteer.name, email: volunteer.email, verified: volunteer.verified } : null
            });
        }

        console.log(JSON.stringify(results, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
inspect();
