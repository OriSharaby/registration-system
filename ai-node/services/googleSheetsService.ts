import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "ChatLogs";

export async function appendChatRow(data: any) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:J`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.conversationId,
          data.customerName,
          data.phoneNumber,
          data.channel,
          data.profileStep,
          data.role,
          data.message,
          new Date().toISOString(),
          data.createdAt || new Date().toISOString(),
          data.updatedAt || new Date().toISOString(),
        ],
      ],
    },
  });
}