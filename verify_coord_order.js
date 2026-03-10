
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

async function checkOrder() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', new mongoose.Schema({ title: String, location: Object }));
        const d = await FoodDonation.findOne({ title: "chocolate cake" });
        if (d) {
            console.log(`Title: ${d.title}`);
            console.log(`Coord 0: ${d.location.coordinates[0]}`);
            console.log(`Coord 1: ${d.location.coordinates[1]}`);
        } else {
            console.log("Not found");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkOrder();
