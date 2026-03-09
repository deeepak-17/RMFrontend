
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function fixVolunteer() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String, isAvailable: Boolean, location: Object }));
        const PickupTask = mongoose.model('PickupTask', new mongoose.Schema({ volunteerId: mongoose.Schema.Types.ObjectId, status: String }));

        const correctAccount = await User.findOne({ email: "efgh123@gmail.com" });
        const typoAccount = await User.findOne({ email: "efgh123@gmali.com" });

        if (!correctAccount || !typoAccount) {
            console.log("Could not find both accounts to fix.");
            process.exit(0);
        }

        console.log(`Fixing volunteer flow:`);

        // 1. Give correct account a location (Coimbatore)
        correctAccount.location = {
            type: "Point",
            coordinates: [76.9665, 11.0168] // Coimbatore, India
        };
        correctAccount.isAvailable = true;
        await correctAccount.save();
        console.log(` - Updated efgh123@gmail.com with location and availability.`);

        // 2. Deactivate typo account so it's not picked by the logic
        typoAccount.isAvailable = false;
        await typoAccount.save();
        console.log(` - Deactivated efgh123@gmali.com typo account.`);

        // 3. Move assigned tasks from typo account to correct account
        const res = await PickupTask.updateMany(
            { volunteerId: typoAccount._id, status: "assigned" },
            { $set: { volunteerId: correctAccount._id } }
        );
        console.log(` - Moved ${res.modifiedCount} assigned tasks to the correct account.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixVolunteer();
