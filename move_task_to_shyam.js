
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function moveTaskToShyam() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String, location: Object }));
        const shyam = await User.findOne({ email: "shyamtestvol@gmail.com" });

        if (!shyam) {
            console.log("Volunteer account 'shyamtestvol@gmail.com' not found.");
            process.exit(0);
        }

        console.log(`Setting location for Shyam (69ae733a77e50bc9bc2b88f8)...`);
        shyam.location = {
            type: "Point",
            coordinates: [76.9665, 11.0168] // Coimbatore, India
        };
        await shyam.save();

        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ status: String, volunteerId: mongoose.Schema.Types.ObjectId }));
        const task = await PickupTask.findOne({ status: "assigned", volunteerId: { $ne: shyam._id } }); // Catch any assigned task that is not for him

        if (task) {
            console.log(`Moving Task ${task._id} to Shyam (shyamtestvol@gmail.com)`);
            task.volunteerId = shyam._id;
            await task.save();
        } else {
            console.log("No currently assigned task found to move to Shyam.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
moveTaskToShyam();
