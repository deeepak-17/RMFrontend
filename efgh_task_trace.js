
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkEfghTasks() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }));
        const efgh = await User.findOne({ name: "efgh" });
        if (!efgh) {
            console.log("No efgh found");
            process.exit(0);
        }
        console.log(`Checking tasks for volunteer: efgh (ID: ${efgh._id})`);
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({
            status: String,
            volunteerId: mongoose.Schema.Types.ObjectId,
            donationId: mongoose.Schema.Types.ObjectId,
        }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));

        const tasks = await PickupTask.find({ volunteerId: efgh._id });
        console.log(`Total tasks ever for efgh: ${tasks.length}`);
        for (const t of tasks) {
            const d = await FoodDonation.findById(t.donationId);
            console.log(` - Task ${t._id} | Status: ${t.status} | Donation: ${d ? d.title : 'Deleted'}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkEfghTasks();
