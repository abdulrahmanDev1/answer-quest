import { type NextRequest, NextResponse } from "next/server";
import Email from "@/components/email";
import { env } from "@/env";
import { render } from "@react-email/components";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
  const { name, question, answer, answerCreatedAt, submitUrl, email } =
    await req.json();

  const emailHtml = render(
    Email({ name, question, answer, answerCreatedAt, submitUrl }),
  );
  const options = {
    from: "hello@d7om.dev",
    to: email,
    subject: "Confirm answer",
    html: emailHtml,
  };

  try {
    await sgMail.send(options);
    return NextResponse.json({ message: "Email sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
