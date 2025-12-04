const axios = require("axios");
const asyncHandler = require("express-async-handler");
const { API_URL } = require("../../task-tracker-frontend/src/config");

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY = process.env.OPENAI_API_KEY;

function getDDMMYYYY(date = new Date()) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  return `${d}-${m}-${y}`;
}

function getNextDateDDMMYYYY() {
  const date = new Date();
  date.setDate(date.getDate() + 1);   // move to next day

  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  return `${d}-${m}-${y}`;
}

function getDayAfterTomorrowDateDDMMYYYY() {
  const date = new Date();
  date.setDate(date.getDate() + 2);   // move to next day

  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  return `${d}-${m}-${y}`;
}

function buildPrompt(text) {
  return `
Break the following user text into a JSON object for creating a task with these keys:
- title: 
- description
- status (To Do, In Progress, Done) (make sure value are case sensitive)
- priority (Low, Medium, High) (make sure value are case sensitive)
- dueDate (DD-MM-YYYY)

Return ONLY valid JSON in the response (no extra explanation). Example format:
{
  "title": "",
  "description": "",
  "status": "",
  "priority": "",
  "dueDate": ""
}


Also, ensure you follow these rules:
- If any field is missing in the user text, provide a reasonable default:
  - title: "New Task"
  - description: same as title
  - status: "To Do"
  - priority: "Medium"
  - dueDate: null
- Make sure the dueDate is in DD-MM-YYYY format. If a date is mentioned, convert it to this format.
- Keep the title concise (max 5 words). If the title is too long, shorten it appropriately.
- The description can be a bit longer (max 20 words). If too long, summarize it.
- Always return valid JSON. If you cannot extract information, use the default values.

Also, if a user mentions some other task-related details, try to incorporate them sensibly into the description field.

Date Rules:
- If the text contains a specific date (like 30-10-2024 or October 30, 2024), convert it to DD-MM-YYYY.
- If the user mentions a relative date (like "tomorrow", "day after tomorrow", "next Monday", "next Friday"), YOU MUST compute it based on today's actual date, not any default or fallback year.
- Today’s date is: **${getDDMMYYYY()}**
- So "tomorrow" = **${getNextDateDDMMYYYY()}**, "day after tomorrow" = **${getDayAfterTomorrowDateDDMMYYYY()}**, etc.
- Do NOT guess or fallback to years like 2023 or 1970.

More date rules:
- “Next <weekday>” means the NEXT upcoming weekday from today (not the current week).
- All due dates must be returned ONLY in DD-MM-YYYY format.
- If no date is found, return dueDate: null.

Now, parse the following text:

User text: "${text}"
`;
}

// safer JSON extraction: tries direct parse, else extracts first {...}
function extractJson(text) {
  if (!text) return null;
  // try parse directly
  try {
    return JSON.parse(text);
  } catch (e) {
    // fallback: extract {...} substring
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        return null;
      }
    }
  }
  return null;
}

const parseVoiceText = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });

  const prompt = buildPrompt(text);

  try {
    const aiResp = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.0,
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = aiResp?.data?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ error: "No response from AI" });
    }

    const parsed = extractJson(content);
    if (!parsed) {
      return res.status(500).json({
        error: "Failed to parse AI response as JSON",
        ai_raw: content,
      });
    }

    // Normalize/validate fields minimally
    const task = {
      title: parsed.title?.trim() || "New Task",
      description: parsed.description?.trim() || title,
      status: parsed.status?.toLowerCase() || "To Do",
      priority: parsed.priority?.toLowerCase() || "Medium",
      dueDate: parsed.dueDate || null,
    };
    if (!task.title) task.title = task.description.split(".")[0] || "New Task";
    res.json(task);
  } catch (err) {
    console.error("AI parse error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI call failed", details: err.message });
  }
});

module.exports = { parseVoiceText };