import { AnswerEmailProps } from "@/components/answer-email";
import { env } from "@/env";
import { render } from "@react-email/components";
import sgMail from "@sendgrid/mail";
import { AnswerEmail } from "@/components/answer-email";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export async function sendAnswerEmail({
  email,
  AnswerEmailProps: {
    name,
    askedQuestion,
    answer,
    answeredBy,
    answerCreatedAt,
    checkUrl,
  },
}: {
  email: string;
  AnswerEmailProps: AnswerEmailProps;
}) {
  const emailHtml = render(
    AnswerEmail({
      name,
      answer,
      answerCreatedAt,
      checkUrl,
      askedQuestion,
      answeredBy,
    }),
  );
  const options = {
    from: "hello@d7om.dev",
    to: email,
    subject: "Your question got answered! 🎉",
    html: emailHtml,
  };

  try {
    await sgMail.send(options);
  } catch (err: any) {
    console.error("Error sending email", err);
  }
}
