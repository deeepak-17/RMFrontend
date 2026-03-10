
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkTaskVolunteerId() {
    try {
        await mongoose.connect(MONGO_URI);
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ volunteerId: mongoose.Schema.Types.ObjectId }));
        const tasks = await PickupTask.find({ status: "assigned" });
        for (const t of tasks) {
            console.log(`Task ${t._id} | Assigned to Volunteer ID: ${t.volunteerId}`);
            const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
            const u = await User.findById(t.volunteerId);
            if (u) {
                console.log(` - User Details: ${u.name} | ${u.email} | Role: ${u.role}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkTaskVolunteerId();
