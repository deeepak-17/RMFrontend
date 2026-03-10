
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function investigate() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, isAvailable: Boolean, verified: Boolean }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String, status: String }));
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ status: String, volunteerId: mongoose.Schema.Types.ObjectId, donationId: mongoose.Schema.Types.ObjectId, ngoId: mongoose.Schema.Types.ObjectId }));

        const efgh = await User.findOne({ name: "efgh" });
        console.log("--- Volunteer 'efgh' ---");
        if (efgh) {
            console.log(`ID: ${efgh._id}`);
            console.log(`Role: ${efgh.role}`);
            console.log(`Verified: ${efgh.verified}`);
            console.log(`Available: ${efgh.isAvailable}`);

            const tasks = await PickupTask.find({ volunteerId: efgh._id });
            console.log(`Tasks assigned to efgh: ${tasks.length}`);
            tasks.forEach(t => console.log(` - Task ${t._id} | Status: ${t.status}`));
        } else {
            console.log("Volunteer 'efgh' not found.");
        }

        const pendingTasks = await PickupTask.find({ status: "pending" });
        console.log(`\n--- Pending Tasks (Waiting for volunteer) ---`);
        console.log(`Count: ${pendingTasks.length}`);
        for (const pt of pendingTasks) {
            const donation = await FoodDonation.findById(pt.donationId);
            console.log(` - Task ${pt._id} | Donation: ${donation ? donation.title : 'Unknown'}`);
        }

        const assignedTasks = await PickupTask.find({ status: "assigned" });
        console.log(`\n--- Assigned Tasks (Not accepted yet) ---`);
        console.log(`Count: ${assignedTasks.length}`);
        for (const at of assignedTasks) {
            const v = await User.findById(at.volunteerId);
            console.log(` - Task ${at._id} | Volunteer: ${v ? v.name : 'Unknown'}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
investigate();
