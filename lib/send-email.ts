import { EmailProps } from "@/components/SubmitForm";

export function sendEmail(data: EmailProps) {
  const apiEndpoint = "/api/email/send";

  fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      // console.log(response.message);
    })
    .catch((err) => {
      console.error(err);
    });
}
