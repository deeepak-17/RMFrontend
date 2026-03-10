
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkPendingTasks() {
    try {
        await mongoose.connect(MONGO_URI);
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ status: String, donationId: mongoose.Schema.Types.ObjectId, volunteerId: mongoose.Schema.Types.ObjectId, ngoId: mongoose.Schema.Types.ObjectId }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));

        const tasks = await PickupTask.find({ status: { $in: ["assigned", "pending"] } });
        console.log(`Found ${tasks.length} tasks matching status: "assigned" or "pending":`);
        for (const t of tasks) {
            const d = await FoodDonation.findById(t.donationId);
            const v = t.volunteerId ? await User.findById(t.volunteerId) : null;
            console.log(`- Task ${t._id} | Status: ${t.status} | Donation: ${d ? d.title : 'Deleted'} | Volunteer: ${v ? v.name : 'UNASSIGNED'}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkPendingTasks();
