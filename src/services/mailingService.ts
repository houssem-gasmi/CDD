import nodemailer from "nodemailer";

// Ensure you are using the correct environment variables
export const sendMail = async (subject: string, body: string, email: string) => {
  try {
    // Set up the SMTP transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use 'gmail' as the service name if you're using Gmail SMTP
      auth: {
        user: process.env.MAIL_USER, // The email you are using for the service (from your .env file)
        pass: process.env.MAIL_PASSWORD, // The password for your email (from your .env file)
      },
    });

    // Define the mail options
    const mailOptions = {
      from: process.env.MAIL_USER, // The email that sends the mail (from your .env file)
      to: email, // The recipient email
      subject: subject, // The subject of the email
      html: `<p>${body}</p>`, // The body of the email in HTML format
    };

    // Send the email and wait for the response
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response); // Log the response from the mail server
    return info.response; // Return the response for logging or further processing
  } catch (error) {
    console.error("Error sending email:", error); // Log the error
    throw error; // Rethrow the error to handle it later in your application
  }
};
