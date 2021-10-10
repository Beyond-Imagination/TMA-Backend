import mongoose from 'mongoose';
import config from 'config';

const connect = async () => {
    try {
        await mongoose.connect(config.get("db.uri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected!!');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

export default {
    connect: connect,
}
