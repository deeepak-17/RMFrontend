import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: 'c:/Users/chand/Downloads/ResQMeals/backend/.env' });
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function inspect() {
    try {
        await mongoose.connect(MONGO_URI);
        const UserSchema = new mongoose.Schema({
            name: String,
            role: String,
            verified: Boolean,
            email: String,
            location: Object
        }, { collection: 'users' });

        const User = mongoose.model('User', UserSchema);

        const volunteers = await User.find({ role: 'volunteer' });
        console.log(`Volunteers count: ${volunteers.length}`);
        volunteers.forEach(v => {
            console.log(`- ${v.name} (${v.email}): Verified=${v.verified}, Location=${JSON.stringify(v.location)}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
inspect();
