
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../ResQMeals/backend/.env') });
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const TaskSchema = new mongoose.Schema({
    status: String,
    volunteerId: mongoose.Schema.Types.ObjectId,
});

async function listTasks() {
    try {
        await mongoose.connect(MONGO_URI);
        const PickupTask = mongoose.model('PickupTask', TaskSchema);
        const tasks = await PickupTask.find({});
        console.log(JSON.stringify(tasks, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listTasks();
