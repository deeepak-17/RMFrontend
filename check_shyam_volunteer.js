
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkShyamVolunteer() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String, isAvailable: Boolean, verified: Boolean, location: Object }));
        const shyam = await User.findOne({ email: "shyamtestvol@gmail.com" });

        if (!shyam) {
            console.log("Volunteer account 'shyamtestvol@gmail.com' NOT FOUND.");
            process.exit(0);
        }

        console.log(`--- Volunteer 'Shyam' Details ---`);
        console.log(`ID: ${shyam._id}`);
        console.log(`Email: ${shyam.email}`);
        console.log(`Role: ${shyam.role}`);
        console.log(`Verified: ${shyam.verified}`);
        console.log(`Available: ${shyam.isAvailable}`);
        console.log(`Location: ${JSON.stringify(shyam.location)}`);

        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({
            volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status: String,
            donationId: mongoose.Schema.Types.ObjectId
        }));
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));

        const tasks = await PickupTask.find({ volunteerId: shyam._id });
        console.log(`\nTasks for Shyam: ${tasks.length}`);
        for (const t of tasks) {
            const d = await FoodDonation.findById(t.donationId);
            console.log(` - [${t.status}] Task ${t._id} | Donation: ${d ? d.title : 'Deleted'}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkShyamVolunteer();
