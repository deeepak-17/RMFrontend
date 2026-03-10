
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkCoords() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String, status: String, location: Object }));
        const donations = await FoodDonation.find({ status: "available" }).limit(5);
        donations.forEach(d => {
            console.log(`Title: ${d.title} | ${d.location.coordinates[0]}, ${d.location.coordinates[1]}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkCoords();
