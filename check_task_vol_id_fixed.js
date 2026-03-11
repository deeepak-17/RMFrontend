
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkTaskVolunteerId() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: String }));

        const tasks = await PickupTask.find({ status: "assigned" }).populate('volunteerId');
        for (const t of tasks) {
            console.log(`Task ${t._id} | Assigned to Volunteer: ${t.volunteerId ? t.volunteerId.name : 'Unknown'} | ID: ${t.volunteerId ? t.volunteerId._id : 'N/A'}`);
            if (t.volunteerId) {
                console.log(` - Email: ${t.volunteerId.email} | Role: ${t.volunteerId.role}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkTaskVolunteerId();
