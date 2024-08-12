import { env } from "@/env";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  name: string;
  question: string;
  answer: string;
  answerCreatedAt: string;
  submitUrl: string;
}

const baseUrl = env.NEXT_PUBLIC_HOSTNAME;

export const Email = ({
  name,
  question,
  answer,
  answerCreatedAt,
  submitUrl,
}: EmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your answer at {baseUrl}</Preview>
      <Body style={main}>
        <Container>
          <Section>
            <Img
              src="https://d7om.dev/D-M.png"
              style={{
                width: "50px",
                borderRadius: "20px",
                padding: "10px",
                margin: "0 auto",
              }}
            />
          </Section>

          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src="https://d226aj4ao1t61q.cloudfront.net/ai2shais_blog_confirmationmail.png"
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {name},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  You recently answered a question on our website.{" "}
                </Heading>

                <Text style={paragraph}>
                  <b>Time: </b>
                  {answerCreatedAt}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Name: </b>
                  {name}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Question: </b>
                  {question}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Answer: </b>
                  {answer}
                </Text>

                <Text style={{ ...paragraph, marginTop: -5 }}>
                  If this was you, please click the button below to confirm and
                  use your question as the current question on the website.
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: "0" }}>
              <Column style={containerButton} colSpan={2}>
                <Button style={button} href={submitUrl}>
                  Confirm
                </Button>
              </Column>
            </Row>
          </Section>

          <Section style={containerImageFooter}>
            <Img
              style={image}
              width={620}
              src="https://react-email-demo-9fn3mchcm-resend.vercel.app/static/yelp-footer.png"
            />
          </Section>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(0,0,0, 0.7)",
            }}
          >
            © 2024 | D7OM | https://d7om.dev
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default Email;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const button = {
  backgroundColor: "#4D44DB",
  borderRadius: 15,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  margin: "0 auto",
  cursor: "pointer",
  padding: "12px 30px",
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
};

const boxInfos = {
  padding: "20px",
};

const containerImageFooter = {
  padding: "45px 0 0 0",
};
