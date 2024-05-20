import sqMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY } = process.env;

sqMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "kotnazar20@gmail.com" };
  await sqMail.send(email);
  return true;
};
