// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI, // visible to users in frontend
//   dangerouslyAllowBrowser: true,
// });

// const systemPrompt = `
// You are an expense parser.
// Convert the user's text into a JSON object with:
// - date (YYYY-MM-DD)
// - category (one word, lowercase)
// - description (short text)
// - amount (number without currency symbol)
// If date not given, use today's date.
// `;

// export async function parseExpense(userText) {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // fast & cheap
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userText },
//       ],
//       response_format: { type: "json_object" }, // forces JSON output
//     });

//     const data = JSON.parse(completion?.choices[0].message.content || "");
//     console.log("data", data);
//     return data;
//   } catch (error) {
//     console.error("Error parsing expense:", error);
//   }
// }
