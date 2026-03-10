
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function findGoodDonation() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String, status: String }));
        const donors = await FoodDonation.find({ status: "available" }).limit(5);

        console.log(`Searching for a good donation...`);
        donors.forEach(d => {
            console.log(`- ${d.title} | ID: ${d._id} | Status: ${d.status}`);
        });

        const reserved = await FoodDonation.find({ status: "reserved" }).limit(5);
        console.log(`\nReserved donations (currently claimed by NGO):`);
        reserved.forEach(d => {
            console.log(`- ${d.title} | ID: ${d._id} | Status: ${d.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
findGoodDonation();
