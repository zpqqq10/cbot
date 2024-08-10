import { getServe } from './serve.js'
//import env from '../utils/env.js';
import { repo24, repoFeng, repoBullshit } from '../assets/index.js'
import { getRandomEle } from '../utils/common.js';
import { hitokoto, zaoan, wangyiyun,help } from '../utils/requests.js'
import { botName, prefixName, aliasWhiteList, roomWhiteList } from '../utils/env.js'


let lastThree = [];
let repeatedWord = '';
// 这里的question是没有艾特的
async function autoReply(isRoom, question, room, talker, type) {//根据聊天内容自动触发，不需要@
  //console.log(question,talker.name(),type)
  if (talker.name() == 'bot') return
  if ((type == 5 || type == 6 || type == 14)) {// 图片/表情/链接
    return
  }
  if (type == 7 && isRoom) {
    // text
    lastThree.push(question);
    if (lastThree.length > 3) {
      lastThree.shift();
    }
    if (lastThree.length == 3 && lastThree[0] == lastThree[1]
      && lastThree[1] == lastThree[2] && lastThree[0] != repeatedWord) {
      repeatedWord = lastThree[0];
      await room.say(lastThree[1])
      return
    } else {
      repeatedWord = '';
      return
    }
  }
}

let lastQueryTime = 0
async function handleCommands(question, room, aibot) {
  if (Date.now() - lastQueryTime < 3000) {
    await room.say('你们打字跟机关枪一样，打这么快我怎么回')
    return;
  }
  lastQueryTime = Date.now()
  switch (question) {
    case '新生指引':
      await room.say('浙大新生指引:https://zjuers.com/welcome')
      return
    case '24点':
      await room.say('24点: ' + getRandomEle(repo24).join(' '))
      return
    case '早安心语':
      await room.say(await zaoan())
      // await room.say('说了不可用你还发，看不懂中文？')
      return
    case '开e！':
    case '开e!':
      await room.say(await wangyiyun())
      return
    case '动漫一言':
      await room.say(await hitokoto('a&c=b'))
      return
    case '小说一言':
      await room.say(await hitokoto('d'))
      return
    case '诗词一言':
      await room.say(await hitokoto('i'))
      return
    case '发疯':
      await room.say(getRandomEle(repoFeng))
      return
    default:
      if (question.length < 3) {
        await room.say(getRandomEle(repoBullshit))
        return
      }
      const randomNum = Math.random()
      // 如果问题太长就不走llm了
      if (question.length < 256 && randomNum < 0.6) {
        await room.say(await aibot(question))
      } else {
        await room.say(getRandomEle(repoBullshit))
      }
      break

  }
  return
}

export async function defaultMessage(msg, bot, ServiceType = 'GPT') {
  const getReply = getServe(ServiceType)
  const contact = msg.talker() // 发消息人
  const receiver = msg.to() // 消息接收人
  var content = msg.text() // 消息内容
  const room = msg.room() // 是否是群消息
  const roomName = (await room?.topic()) || null // 群名称
  const alias = (await contact.alias()) || (await contact.name()) // 发消息人的通讯录备注/昵称(不是群昵称)
  const remarkName = await contact.alias() // 备注名称
  const name = await contact.name() // 微信名称
  const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
  // if(isText){
  //   console.log('🌸🌸🌸 / content: ', content)
  // }
  const isRoom = roomWhiteList.includes(roomName)  // 是否在群聊白名单内并且艾特了机器人
  const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
  const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己
  // TODO 你们可以根据自己的需求修改这里的逻辑
  if (isBotSelf) return // 如果是机器人自己发送的消息或者消息类型不是文本则不处理
  try {
    // 区分群聊和私聊
    if (isRoom && room) {
      const isQuote=content.includes('- - - - - - - - - - - - - - -')
      if(isQuote){//是回复
        content=content.split('- - - - - - - - - - - - - - -\n')[1] //获取回复的内容
        //console.log('real content',content)
      }
      const isMention = prefixName.some(prefix => {
        // startswith避免引用
        // 微信的艾特后面是一个特殊符号，不是普通空格
        return content.startsWith(prefix + ' ');
      });
      // a bug in the lib
      // const isMention = await msg.mentionSelf() // 是否艾特了机器人
      //查找是否包含所需的前缀,如[bot],@bot等
      if (!isMention) {
        autoReply(isRoom, content, room, contact, msg.type())
        return;
      }
      const question = content.replace(`${botName} `, '') // 去掉艾特的消息主体
      //随机数
      const timeout = 500 + Math.floor(Math.random() * 1000)
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
