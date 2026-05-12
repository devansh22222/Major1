import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBFgeKesS5PhtE6lMF4QFfke7kjBN8VFpI");

async function run() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent("Hello");

  console.log(result.response.text());
}

run();