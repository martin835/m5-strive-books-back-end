import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendRegistrationEmail = async (body) => {
  console.log("recieved body:", body);
  const msg = {
    //normally recipient email will come from request.author.email;
    // ⬇️ ⬇️ ⬇️ this is just for the testing purposes
    to: "antonstrohy12531@gmail.com",
    from: process.env.SENDER_EMAIL,
    subject: "Article " + body.title + " created",
    text: body.content,
    html: `<h3>${body.title}</h3>
    <p>${body.content}</p>`,
  };

  await sgMail.send(msg);
};
