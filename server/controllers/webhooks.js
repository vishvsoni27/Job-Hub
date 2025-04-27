import User from "../models/User.js";
import { Webhook } from "svix";

//API Controller Function To Manage Clerk User with databse.
export const clerkWebhook = async (req, res) => {
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
        res.status(200).json({ message: "User created successfully" });
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        });

        res.status(200).json({ message: "User updated successfully" });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);

        res.status(200).json({ message: "User deleted successfully" });
        break;
    }

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
