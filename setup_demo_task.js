
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from both possible locations
dotenv.config({ path: path.join(__dirname, '../ResQMeals/backend/.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    location: { type: Object },
    sustainabilityCredits: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true }
});

const DonationSchema = new mongoose.Schema({
    donorId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    quantity: String,
    expiryTime: Date,
    status: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
        address: String
    }
});

const TaskSchema = new mongoose.Schema({
    volunteerId: mongoose.Schema.Types.ObjectId,
    donationId: mongoose.Schema.Types.ObjectId,
    ngoId: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedAt: Date
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const FoodDonation = mongoose.models.FoodDonation || mongoose.model('FoodDonation', DonationSchema);
const PickupTask = mongoose.models.PickupTask || mongoose.model('PickupTask', TaskSchema);

async function setupDemoData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the volunteer
        const volunteer = await User.findOne({ email: 'efgh123@gmali.com' });
        if (!volunteer) {
            console.error('Volunteer not found!');
            process.exit(1);
        }

        // Find or create a donor
        let donor = await User.findOne({ role: 'donor' });
        if (!donor) {
            donor = await User.create({ name: 'Demo Donor', email: 'donor@example.com', role: 'donor' });
        }

        // Find or create an NGO
        let ngo = await User.findOne({ role: 'ngo' });
        if (!ngo) {
            ngo = await User.create({ name: 'Demo NGO', email: 'ngo@example.com', role: 'ngo' });
        }

        // Create a fake donation
        const donation = await FoodDonation.create({
            donorId: donor._id,
            title: 'Fresh Veggies & Fruits',
            description: 'Assorted seasonal vegetables and fruits',
            quantity: '15 units',
            expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
            status: 'accepted',
            location: {
                type: 'Point',
                coordinates: [77.2090, 28.6139], // Delhi
                address: '123 Market St, New Delhi'
            }
        });

        // Create a task for this volunteer
        const task = await PickupTask.create({
            volunteerId: volunteer._id,
            donationId: donation._id,
            ngoId: ngo._id,
            status: 'assigned',
            assignedAt: new Date()
        });

        console.log(`Successfully created task ${task._id} for volunteer ${volunteer.name}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setupDemoData();
