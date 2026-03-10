
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../ResQMeals/backend/.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const UserSchema = new mongoose.Schema({
    email: String,
    role: String,
    verified: Boolean,
});

async function updateRole() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', UserSchema);
        await User.updateOne({ email: 'efgh123@gmali.com' }, { role: 'volunteer', verified: true });
        console.log('User role updated to volunteer and verified.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
updateRole();
