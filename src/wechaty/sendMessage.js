import { getServe } from './serve.js'
import dotenv from 'dotenv'
import { repo24, repoFeng } from '../../assets/index.js'
import { getRandomEle } from '../utils/common.js';
import { hitokoto, zaoan } from '../utils/requests.js'
// 加载环境变量
dotenv.config()
const env = dotenv.config().parsed // 环境参数

// 从环境变量中导入机器人的名称
const botName = env.BOT_NAME
//触发机器人的前缀
const prefixName = env.PREFIX ? env.PREFIX.split(',') : []
// 从环境变量中导入联系人白名单
const aliasWhiteList = env.ALIAS_WHITELIST ? env.ALIAS_WHITELIST.split(',') : []

// 从环境变量中导入群聊白名单
const roomWhiteList = env.ROOM_WHITELIST ? env.ROOM_WHITELIST.split(',') : []


async function autoReply(question, room, talker, type) {//根据聊天内容自动触发，不需要@
  //console.log(question,talker.name(),type)
  if (talker.name() == 'bot') return
  if ((type == 5 || type == 6 || type == 14)) {// 图片/表情/链接
    return
  }
}

const checkAliasMinute = 5.0
let lastCheckAliasTime = 0
async function handleCommands(question, room, aibot) {

  // if (question.includes('ai问答')) {
  //   //await room.say(await aibot(question)) //kimi的api用完了
  //   return
  // }
  if (question.includes('新生指引')) {
    await room.say('浙大新生指引:https://zjuers.com/welcome')
    return
  }
  if (question.includes('早安心语')) {
    // await room.say(await zaoan())
    await room.say('说了不可用你还发，看不懂中文？')
    return
  }
  if (question == '24点') {
    await room.say('24点: ' + getRandomEle(repo24).join(' '))
    return
  }
  if (question == '帮助') {
    return await room.say('使用@bot或[bot]唤起机器人，可用的指令如下:\n\
         1. 新生指引: 返回新生指引\n\
         2. 帮助: 显示帮助\n\
         3. {动漫/小说/诗词}一言: 返回相关的句子\n\
         4. 早安心语[暂不可用]\n\
         5. 24点\n\
         其他功能锐意制作中!\n\
    ')
  }
  if (question == '动漫一言') {
    await room.say(await hitokoto('a&c=b'))
    return
  }
  if (question == '小说一言') {
    await room.say(await hitokoto('d'))
    return
  }
  if (question == '诗词一言') {
    await room.say(await hitokoto('i'))
    return
  }
  if (question == '发疯') {
    await room.say(getRandomEle(repoFeng))
    return
  }
  await room.say('？')
}

let lastQueryTime = 0
export async function defaultMessage(msg, bot, ServiceType = 'GPT') {
  if (Date.now() - lastQueryTime < 1500) {
    return;
  }
  lastQueryTime = Date.now()
  const getReply = getServe(ServiceType)
  //console.log('🌸🌸🌸 / content: ', msg.text())
  //console.log('🌸🌸🌸 / contact: ', msg.talker().name())
  //console.log('🌸🌸🌸 / type: ', msg.type())
  const contact = msg.talker() // 发消息人
  const receiver = msg.to() // 消息接收人
  const content = msg.text() // 消息内容
  const room = msg.room() // 是否是群消息
  const roomName = (await room?.topic()) || null // 群名称
  const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
  const remarkName = await contact.alias() // 备注名称
  const name = await contact.name() // 微信名称
  const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
  const isRoom = roomWhiteList.includes(roomName)  // 是否在群聊白名单内并且艾特了机器人
  const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
  const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己
  // TODO 你们可以根据自己的需求修改这里的逻辑
  if (isBotSelf) return // 如果是机器人自己发送的消息或者消息类型不是文本则不处理
  try {
    // 区分群聊和私聊
    if (isRoom && room) {
      const isMention = prefixName.some(prefix => {
        return content.startsWith(prefix);
      });
      //查找是否包含所需的前缀,如[bot],@bot等
      if (!isMention) {
        autoReply(content, room, contact, msg.type())
        return;
      }
      const question = (await msg.mentionText()) || content.replace(`${botName}`, '') // 去掉艾特的消息主体
      console.log('🌸🌸🌸 / question: ', question)
      //随机数
      const timeout = 500 + Math.floor(Math.random() * 2000)
      await new Promise(resolve => setTimeout(resolve, timeout));//随机延迟
      await handleCommands(question, room, getReply)

    }
    // 私人聊天，白名单内的直接发送
    if (isAlias && !room) {
      console.log('🌸🌸🌸 / content: ', content)
      // const response = await getReply(content)
      // await contact.say(response)
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 分片消息发送
 * @param message
 * @param bot
 * @returns {Promise<void>}
 */
export async function shardingMessage(message, bot) {
  const talker = message.talker()
  const isText = message.type() === bot.Message.Type.Text // 消息类型是否为文本
  if (talker.self() || message.type() > 10 || (talker.name() === '微信团队' && isText)) {
    return
  }
  const text = message.text()
  const room = message.room()
  if (!room) {
    console.log(`Chat GPT Enabled User: ${talker.name()}`)
    const response = await getChatGPTReply(text)
    await trySay(talker, response)
    return
  }
  let realText = splitMessage(text)
  // 如果是群聊但不是指定艾特人那么就不进行发送消息
  if (text.indexOf(`${botName}`) === -1) {
    return
  }
  realText = text.replace(`${botName}`, '')
  const topic = await room.topic()
  const response = await getChatGPTReply(realText)
  const result = `${realText}\n ---------------- \n ${response}`
  await trySay(room, result)
}

// 分片长度
const SINGLE_MESSAGE_MAX_SIZE = 500

/**
 * 发送
 * @param talker 发送哪个  room为群聊类 text为单人
 * @param msg
 * @returns {Promise<void>}
 */
async function trySay(talker, msg) {
  const messages = []
  let message = msg
  while (message.length > SINGLE_MESSAGE_MAX_SIZE) {
    messages.push(message.slice(0, SINGLE_MESSAGE_MAX_SIZE))
    message = message.slice(SINGLE_MESSAGE_MAX_SIZE)
  }
  messages.push(message)
  for (const msg of messages) {
    await talker.say(msg)
  }
}

/**
 * 分组消息
 * @param text
 * @returns {Promise<*>}
 */
async function splitMessage(text) {
  let realText = text
  const item = text.split('- - - - - - - - - - - - - - -')
  if (item.length > 1) {
    realText = item[item.length - 1]
  }
  return realText
}
