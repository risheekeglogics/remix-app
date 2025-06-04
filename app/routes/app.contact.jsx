import { useState } from "react";
import { useActionData, Form as RemixForm } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Text
} from "@shopify/polaris";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const message = formData.get("message");

  console.log("Form submitted:", { name, message });

  return { success: true, name };
};

export default function ContactPage() {
  const actionData = useActionData();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Page title="Contact Us">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <RemixForm method="POST">
              <TextField
                label="Your Name"
                name="name"
                value={name}
                onChange={setName}
                requiredIndicator
                autoComplete="name"
              />
              <br />
              <TextField
                label="Your Message"
                name="message"
                value={message}
                onChange={setMessage}
                multiline={4}
                requiredIndicator
                autoComplete="off"
              />
              <br />
              <Button submit primary>
                Send
              </Button>
            </RemixForm>
            {actionData?.success && (
              <Text variant="bodyMd" tone="success">
                Thanks for your message, {actionData.name}!
              </Text>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
