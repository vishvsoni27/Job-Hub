import User from "../models/User.js";
import { Webhook } from "svix";

//API Controller Function To Manage Clerk User with databse.
export const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify the webhook payload and headers.
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting data from request body.
    const { data, type } = req.body;

    // Switch cases for different types of events.
    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        });
        res.json({});
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        });

        res.json({});
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);

        res.json({});
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error : " + error.message,
    });
  }
};
