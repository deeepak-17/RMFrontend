
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const UserSchema = new mongoose.Schema({ name: String, role: String, email: String });
const FoodDonationSchema = new mongoose.Schema({ title: String, status: String });
const PickupTaskSchema = new mongoose.Schema({
    status: String,
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodDonation' },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
});

async function checkTasks() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', UserSchema);
        const FoodDonation = mongoose.model('FoodDonation', FoodDonationSchema);
        const PickupTask = mongoose.model('PickupTask', PickupTaskSchema);

        const tasks = await PickupTask.find({})
            .populate('volunteerId')
            .populate('donationId')
            .populate('ngoId')
            .sort({ createdAt: -1 });

        console.log(`Found ${tasks.length} total tasks in the system:`);
        tasks.forEach(t => {
            const vName = t.volunteerId ? t.volunteerId.name : "UNASSIGNED";
            const dTitle = t.donationId ? t.donationId.title : "DELETED";
            const nName = t.ngoId ? t.ngoId.name : "UNKNOWN";
            console.log(`- [${t.status}] Task: ${t._id} | Volunteer: ${vName} | Donation: ${dTitle} | NGO: ${nName}`);
        });

        const volunteer = await User.findOne({ role: "volunteer", name: "efgh" });
        if (volunteer) {
            console.log(`\n- Volunteer 'efgh' (ID: ${volunteer._id}) is currently ${volunteer.isAvailable ? 'ONLINE' : 'OFFLINE'}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkTasks();
