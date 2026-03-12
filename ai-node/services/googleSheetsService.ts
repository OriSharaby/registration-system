// import { google } from "googleapis";
// import path from "path";

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(process.cwd(), "google-credentials.json"),
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({
//   version: "v4",
//   auth,
// });

// const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
// const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "ChatLogs";

// export async function appendChatRow(data: any) {
//   await sheets.spreadsheets.values.append({
//     spreadsheetId: SPREADSHEET_ID,
//     range: `${SHEET_NAME}!A:J`,
//     valueInputOption: "USER_ENTERED",
//     requestBody: {
//       values: [
//         [
//           data.conversationId,
//           data.customerName,
//           data.phoneNumber,
//           data.channel,
//           data.profileStep,
//           data.role,
//           data.message,
//           new Date().toISOString(),
//           data.createdAt || new Date().toISOString(),
//           data.updatedAt || new Date().toISOString(),
//         ],
//       ],
//     },
//   });
// }

import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT as string),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
    version: "v4",
    auth,
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "ChatLogs";

export async function appendChatRow(data: any) {
    try {
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
                        data.timestamp
                            ? new Date(data.timestamp).toISOString()
                            : new Date().toISOString(),
                        data.createdAt
                            ? new Date(data.createdAt).toISOString()
                            : new Date().toISOString(),
                        data.updatedAt
                            ? new Date(data.updatedAt).toISOString()
                            : new Date().toISOString(),
                    ],
                ],
            },
        });
    } catch (e) {
        console.log("Append Chart Row Error :", e);
    }

}

export async function updateConversationRows(
    conversationId: string,
    updates: {
        customerName?: string;
        phoneNumber?: string;
        profileStep?: string;
    }
) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:J`,
        });

        const rows = response.data.values;
        if (!rows) return;

        const rowUpdates: { range: string; values: string[][] }[] = [];

        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] !== conversationId) continue;

            const row = [...rows[i]];
            let changed = false;

            if (updates.customerName !== undefined && row[1] !== updates.customerName) {
                row[1] = updates.customerName;
                changed = true;
            }
            if (updates.phoneNumber !== undefined && row[2] !== updates.phoneNumber) {
                row[2] = updates.phoneNumber;
                changed = true;
            }
            if (updates.profileStep !== undefined && row[4] !== updates.profileStep) {
                row[4] = updates.profileStep;
                changed = true;
            }

            if (changed) {
                const sheetRow = i + 1;
                rowUpdates.push({
                    range: `${SHEET_NAME}!A${sheetRow}:J${sheetRow}`,
                    values: [row],
                });
            }
        }

        if (rowUpdates.length === 0) return;

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: "USER_ENTERED",
                data: rowUpdates,
            },
        });
    } catch (e) {
        console.log("Error updateing conversation rows :", e);
    }
}