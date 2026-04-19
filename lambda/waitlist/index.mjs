import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const ddb = new DynamoDBClient({});
const sm = new SecretsManagerClient({});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return respond(400, "Invalid JSON");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return respond(400, "Invalid email address");
  }

  try {
    await ddb.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          email: { S: email },
          timestamp: { S: new Date().toISOString() },
          source: { S: "waitlist-form" },
        },
        ConditionExpression: "attribute_not_exists(email)",
      })
    );
  } catch (err) {
    // ConditionalCheckFailedException means email already registered — treat as success
    if (err.name !== "ConditionalCheckFailedException") {
      console.error("DynamoDB error", err);
      return respond(500, "Internal server error");
    }
  }

  try {
    const secret = await sm.send(
      new GetSecretValueCommand({ SecretId: process.env.RESEND_SECRET_ARN })
    );
    const { api_key: apiKey } = JSON.parse(secret.SecretString);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "waitlist@send.housemoneyportfolio.com",
        to: [process.env.NOTIFICATION_EMAIL],
        subject: "New waitlist signup",
        text: `New signup: ${email}`,
      }),
    });

    if (!res.ok) {
      // Log but don't fail the request — DDB write already succeeded
      console.error("Resend error", res.status, await res.text());
    }
  } catch (err) {
    console.error("Notification error", err);
    // Don't return 500 — the lead is captured in DDB
  }

  return respond(200, "Success");
};

const respond = (statusCode, message) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});
