import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

const biblePath = path.resolve(process.cwd(), "SWAIP_BIBLE.md");
let bibleContent;
try {
  bibleContent = readFileSync(biblePath, "utf-8").trim();
} catch (err) {
  throw new Error("SWAIP_BIBLE.md missing", { cause: err });
}

const SYSTEM_CONTENT =
  `The following is your complete identity, memory, and canon. Embody it fully.\n\n` +
  bibleContent;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function handleMessage({ text, history = [] }) {
  const messages = [
    ...history,
    { role: "user", content: text },
  ];
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system: SYSTEM_CONTENT,
    messages,
  });
  return response.content[0]?.text?.trim() || "...";
}
