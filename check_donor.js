
import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://deepakbond008_db_user:rescuemeals@cluster0.9wpozu7.mongodb.net/?appName=Cluster0";

const FoodDonationSchema = new mongoose.Schema({
    title: String,
    status: String,
    donorId: mongoose.Schema.Types.ObjectId,
});

async function checkDonationDonor() {
    try {
        await mongoose.connect(MONGO_URI);
        const FoodDonation = mongoose.model('FoodDonation', FoodDonationSchema);
        const donation = await FoodDonation.findOne({ title: "chocolate cake" });
        if (donation) {
            console.log(`Donation: ${donation.title}`);
            console.log(`Donor ID: ${donation.donorId}`);

            const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }));
            const user = await User.findById(donation.donorId);
            if (user) {
                console.log(`Donor Name: ${user.name}`);
                console.log(`Donor Role: ${user.role}`);
            } else {
                console.log("Donor NOT FOUND in Users collection!");
            }
        } else {
            console.log("Donation NOT FOUND!");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkDonationDonor();
