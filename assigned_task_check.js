
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkAssignedTasks() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }));
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({
            status: String,
            volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            donationId: mongoose.Schema.Types.ObjectId,
            ngoId: mongoose.Schema.Types.ObjectId,
        }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));

        const tasks = await PickupTask.find({ status: "assigned" }).populate('volunteerId');
        console.log(`There are ${tasks.length} currently ASSIGNED tasks:`);
        for (const t of tasks) {
            const donation = await FoodDonation.findById(t.donationId);
            const vName = t.volunteerId ? t.volunteerId.name : "UNKNOWN";
            console.log(`- Task ${t._id} | Volunteer: ${vName} | Donation: ${donation ? donation.title : 'Deleted'}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkAssignedTasks();
