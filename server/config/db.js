import { connect } from "mongoose";

// URI for MongoDB Atlas
const URI = process.env.MONGODB_ATLAS_URI + "/JobHub";

// URI for MongoDB Compass
// const URI = process.env.MONGODB_COMPASS_URI + "/JobHub";

const connectDB = async () => {
  await connect(URI)
    .then(() => {
      console.log("backend is connected to MongoDB");
    })
    .catch((err) => {
      console.error({ msg: "Faliled to connect MongoDB", error: err });
      process.exit();
    });
};

export default connectDB;
