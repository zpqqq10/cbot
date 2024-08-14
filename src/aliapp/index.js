import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
// import OpenAIApi from 'openai'
import { env } from '../utils/env.js'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const __dirname = path.resolve()
// 判断是否有 .env 文件, 没有则报错
const envPath = path.join(__dirname, '.env')
if (!fs.existsSync(envPath)) {
  console.log('❌ 请先根据文档，创建并配置.env文件！')
  process.exit(1)
}

function setConfig(prompt, room,) {
  return {
    method: 'post',
    url: env.ALI_PROXY_URL,
    headers: {
      'Content-Type': 'application/json',
      // Accept: 'application/json',
      Authorization: `Bearer ${env.ALI_API_KEY}`,
    },
    data: JSON.stringify({
      input: {
        prompt: prompt,
        session_id: room
      },
      parameters: {},
      debug: {}
    }),
  }
}

export async function getAliReply(prompt, room, talker) {
  prompt = talker + '：' + prompt
  console.log('🚀🚀🚀 / prompt', prompt, room)
  try {
    const config = setConfig(prompt, room)
    const response = await axios(config)
    return response.data.output.text
  } catch (error) {
    console.error(error)
  }
}
