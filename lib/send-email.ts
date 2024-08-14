import { EmailProps } from "@/components/SubmitForm";

export function sendEmail(data: EmailProps) {
  const apiEndpoint = "/api/email/send";

  fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .catch(() => {});
}
