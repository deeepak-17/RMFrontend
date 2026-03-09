
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkVolunteerEfgh() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, location: Object, verified: Boolean, isAvailable: Boolean }));
        const efgh = await User.findOne({ role: "volunteer", name: "efgh" });
        if (efgh) {
            console.log(`Volunteer: ${efgh.name}`);
            console.log(`Verified: ${efgh.verified}`);
            console.log(`Available: ${efgh.isAvailable}`);
            console.log(`Location: ${JSON.stringify(efgh.location)}`);
        } else {
            console.log("No volunteer named 'efgh' found.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkVolunteerEfgh();
