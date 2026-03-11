
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function verifyFix() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }));
        const correct = await User.findOne({ email: "efgh123@gmail.com" });
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ volunteerId: mongoose.Schema.Types.ObjectId, status: String }));
        const counts = await PickupTask.countDocuments({ volunteerId: correct._id, status: "assigned" });
        console.log(`Volunteer ${correct.name} now has ${counts} assigned tasks in DB.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verifyFix();
