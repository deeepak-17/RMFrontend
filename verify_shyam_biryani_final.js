
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function verifyShyamTaskBiryani() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));
        const shyam = await User.findOne({ email: "shyamtestvol@gmail.com" });

        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ status: String, volunteerId: mongoose.Schema.Types.ObjectId, donationId: mongoose.Schema.Types.ObjectId }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));

        const task = await PickupTask.findOne({ volunteerId: shyam._id }).populate('donationId');
        if (task) {
            console.log(`Bingo! Shyam now has 'Biriyani' task.`);
            console.log(`Task ID: ${task._id}`);
            console.log(`Donation: Biriyani`);
            console.log(`Status: ${task.status}`);
        } else {
            console.log("No task for him found!");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verifyShyamTaskBiryani();
