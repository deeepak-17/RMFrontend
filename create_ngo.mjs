import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config({ path: 'c:/Users/chand/Downloads/ResQMeals/backend/.env' });

async function createNGO() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const hash = await bcrypt.hash('Password123!', 10);
        await User.create({
            name: 'Happy Meals NGO',
            email: 'ngo@resqmeals.com',
            password: hash,
            role: 'ngo',
            verified: true,
            organizationType: 'shelter',
            location: {
                type: 'Point',
                coordinates: [76.9558, 11.0168],
                address: 'Coimbatore City'
            }
        });
        console.log("Created NGO");
        await mongoose.disconnect();
    } catch (e) {
        console.error("error", e);
    }
}
createNGO();
