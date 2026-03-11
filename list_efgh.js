
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function listAllEfgh() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String, verified: Boolean, isAvailable: Boolean }));
        const users = await User.find({ name: "efgh" });
        console.log(`Found ${users.length} users with name 'efgh':`);
        users.forEach(u => {
            console.log(`- ${u._id} | ${u.email} | Role: ${u.role} | Verified: ${u.verified} | Available: ${u.isAvailable}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listAllEfgh();
