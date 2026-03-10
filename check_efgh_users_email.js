
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkEfghUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
        const users = await User.find({ name: "efgh" });
        users.forEach(u => {
            console.log(`ID: ${u._id} | Email: ${u.email} | Role: ${u.role}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkEfghUsers();
