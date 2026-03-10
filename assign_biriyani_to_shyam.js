
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function assignBiriyaniToShyam() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));
        const shyam = await User.findOne({ email: "shyamtestvol@gmail.com" });

        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String }));
        const biriyani = await FoodDonation.findOne({ title: { $regex: /Biriyani/i } });

        if (!biriyani) {
            console.log("Biriyani NOT FOUND!");
            process.exit(1);
        }

        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ status: String, donationId: mongoose.Schema.Types.ObjectId, volunteerId: mongoose.Schema.Types.ObjectId }));
        let task = await PickupTask.findOne({ donationId: biriyani._id });

        if (task) {
            console.log(`Found task for Biriyani. Status: ${task.status}. Old Volunteer ID: ${task.volunteerId}`);
            task.volunteerId = shyam._id;
            task.status = "assigned";
            await task.save();
            console.log("SUCCESS! Task updated for Shyam.");
        } else {
            console.log("No task found for Biriyani. Creating one for testing...");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
assignBiriyaniToShyam();
