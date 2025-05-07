import NextAuth from "@node_modules/next-auth";
import GoogleProvider from "@node_modules/next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

console.log({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        if (!profile.email_verified) {
          console.log("Email not verified");
          return false; // Deny access if email is not verified
        }

        // Check if a user already exists in the database
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          // Generate a valid username
          let username = profile.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(); // Remove non-alphanumeric characters
          username = username.substring(0, 20); // Truncate to 20 characters

          // Ensure the username is between 8 and 20 characters
          if (username.length < 8) {
            username = username.padEnd(8, "0"); // Pad with "0" if too short
          } else if (username.length > 20) {
            username = username.substring(0, 20); // Truncate if too long
          }

          // Ensure uniqueness by appending a random number if necessary
          const isUsernameTaken = await User.findOne({ username });
          if (isUsernameTaken) {
            username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`; // Append a random 4-digit number
          }

          console.log("Generated username:", username);

          await User.create({
            email: profile.email,
            username: username.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error creating user:", error.errors);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
