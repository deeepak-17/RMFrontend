
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
    verified: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkVolunteer() {
    try {
        await mongoose.connect(MONGO_URI);
        const user = await User.findOne({ email: 'efgh123@gmali.com' });
        if (user) {
            console.log(`User found: ${user.email}, Verified: ${user.verified}`);
            if (!user.verified) {
                user.verified = true;
                await user.save();
                console.log('User has been VERIFIED.');
            }
        } else {
            console.log('User not found.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkVolunteer();
