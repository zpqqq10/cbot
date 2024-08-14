import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
import OpenAIApi from 'openai'
import dotenv from 'dotenv'
const env = dotenv.config().parsed // 环境参数
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
// 判断是否有 .env 文件, 没有则报错
const envPath = path.join(__dirname, '.env')
if (!fs.existsSync(envPath)) {
  console.log('❌ 请先根据文档，创建并配置.env文件！')
  process.exit(1)
}

let config = {
  apiKey: env.OPENAI_API_KEY,
  organization: '',
}
if (env.OPENAI_PROXY_URL) {
  config.baseURL = env.OPENAI_PROXY_URL
}
const openai = new OpenAIApi(config)
const chosen_model = env.OPENAI_MODEL || 'gpt-4o'
let context = []


export async function getGptReply(prompt, talker) {
  prompt = talker + '：' + prompt
  console.log('🚀🚀🚀 / prompt', prompt)
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: env.OPENAI_SYSTEM_MESSAGE },
      ...context,
      { role: 'user', content: prompt },
    ],
    model: chosen_model,
  })
  console.log('🚀🚀🚀 / reply', response.choices[0].message.content)
  context.push({ role: 'user', content: prompt });
  context.push({ role: 'assistant', content: response.choices[0].message.content });
  if (context.length > 20) {
    context.shift()
    context.shift()
  }
  return `${response.choices[0].message.content}`
}
