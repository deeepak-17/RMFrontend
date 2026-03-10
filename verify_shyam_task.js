
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function verifyShyamTask() {
    try {
        await mongoose.connect(MONGO_URI);
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ status: String, volunteerId: mongoose.Schema.Types.ObjectId, donationId: mongoose.Schema.Types.ObjectId }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));
        const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));

        const shyam = await User.findOne({ email: "shyamtestvol@gmail.com" });
        if (!shyam) {
            console.log("Shyam NOT FOUND!");
            process.exit(1);
        }

        const task = await PickupTask.findOne({ volunteerId: shyam._id, status: "assigned" });
        if (task) {
            const d = await FoodDonation.findById(task.donationId);
            console.log(`Bingo! Shyam now has a task assigned.`);
            console.log(`Task ID: ${task._id}`);
            console.log(`Donation: ${d ? d.title : 'Deleted?'}`);
            console.log(`Status: ${task.status}`);
        } else {
            console.log("No assigned task found for Shyam.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verifyShyamTask();
