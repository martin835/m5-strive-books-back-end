import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendRegistrationEmail = async (body) => {
  console.log("recieved body:", body);
  const msg = {
    to: body.email,
    from: process.env.SENDER_EMAIL,
    subject: "Article " + body.title + " created",
    text: body.content,
    html: `<h3>${body.title}</h3>
    <p>${body.content}</p>`,
  };

  await sgMail.send(msg);
};
