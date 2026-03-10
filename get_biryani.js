import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = (await import('path')).dirname(__filename);

dotenv.config({ path: 'c:/Users/chand/Downloads/ResQMeals/backend/.env' });
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function inspect() {
    try {
        await mongoose.connect(MONGO_URI);
        const DonSchema = new mongoose.Schema({}, { strict: false, collection: 'fooddonations' });
        const FoodDonation = mongoose.model('FoodDonation', DonSchema);

        const biryani = await FoodDonation.findOne({ title: /fish biryani/i });
        if (biryani) {
            const fullDoc = biryani.toObject();
            fs.writeFileSync('c:/Users/chand/Downloads/RMFrontend/biryani_full.json', JSON.stringify(fullDoc, null, 2));
            process.stdout.write("Found fish biryani, written to biryani_full.json\n");
        } else {
            process.stdout.write("NOT FOUND\n");
        }
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('c:/Users/chand/Downloads/RMFrontend/biryani_error.txt', err.stack);
        process.exit(1);
    }
}
inspect();
