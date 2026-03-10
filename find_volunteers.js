
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function findVolunteers() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
        const volunteers = await User.find({ role: "volunteer" });
        console.log(`Found ${volunteers.length} volunteers:`);
        volunteers.forEach(v => {
            console.log(`- ${v.name} | ID: ${v._id} | Email: ${v.email}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
findVolunteers();
