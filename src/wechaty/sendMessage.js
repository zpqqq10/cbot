import { getServe } from './serve.js'
//import env from '../utils/env.js';
import { repo24, repoFeng, repoBullshit, diaotu, repoRuozhi } from '../assets/index.js'
import { getRandomEle, searchCurriculum, updateCurriculum, lyricsSolitaire } from '../utils/common.js';
import { hitokoto, zaoan, wangyiyun, help } from '../utils/requests.js'
import { botName, aliasWhiteList, roomWhiteList } from '../utils/env.js'
import { replyTimeLimit, llmProbs, questionMaxLength, questionMinLength, numMsgGuide } from '../utils/env.js'
import { FileBox } from 'file-box'

let lastTwo = ['', ''];
let repeatedWord = '';
// 这里的question是没有艾特的
async function autoReply(isRoom, question, room, talker, msg) {//根据聊天内容自动触发，不需要@
    const type = msg.type();
    //console.log(question,talker.name(),type)
    if (talker.name() == 'bot') return
    if (type == 5 && isRoom) {
        // emotion
        const emotionMD5 = question.match(/md5="([^"]+)"/)[1]
        lastTwo.push(emotionMD5)
        lastTwo.shift()
        if (lastTwo[0] == lastTwo[1] && lastTwo[0] != repeatedWord) {
            repeatedWord = lastTwo[0];
            if (lastTwo[0] == 'b4e94d227527f166e7943a9e6456da5b' || lastTwo[0] == 'adc66f1303156e2efba77c978fc02f80' || lastTwo[0] == 'd555e386bf96599221008ec0e4aea376') {
                await room.say('你们对zpq友善点吧/流泪')
            } else {
                await msg.forward(room);
            }
            return
        } else if (lastTwo[0] != lastTwo[1]) {
            repeatedWord = '';
            return
        }
    }
    if (type == 7 && isRoom) {
        // text 
        lastTwo.push(question);
        lastTwo.shift();
        const nextLyric = lyricsSolitaire(question)
        if (nextLyric != '') {
            await room.say(nextLyric)
            return
        }

        if (lastTwo[0] == lastTwo[1] && lastTwo[0] != repeatedWord) {
            repeatedWord = lastTwo[0];
            await room.say(lastTwo[1])
            return
        } else if (lastTwo[0] != lastTwo[1]) {
            repeatedWord = '';
            return
        }
    }
}

let lastQueryTime = {}
let isLastLLM = false
async function handleCommands(question, room, aibot, talker) {
    const roomName = await room.topic()
    var lastTime = 0
    if (roomName in lastQueryTime) {
        lastTime = lastQueryTime[roomName]
    } else {
        lastQueryTime[roomName] = 0
    }
    if (Date.now() - lastTime < replyTimeLimit) {
        const randomNumm = Math.random()
        if (randomNumm < 0.5) {
            await room.say('你们打字跟机关枪一样，打这么快我怎么回')
        } else {
            await room.say('能不能慢一点呀，穷寇莫追啊！')
        }
        return;
    }
    lastQueryTime[roomName] = Date.now()
    switch (question) {
        case '新生指引':
            await room.say('浙大新生指引:https://zjuers.com/welcome')
            return
        case '24点':
            await room.say('24点: ' + getRandomEle(repo24).join(' '))
            return
        case '早安心语':
            await room.say(await zaoan())
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
        // case '帮助':
        //   await room.say(await help())
        //   return
        case '--help':
        case '-h':
            await room.say('你很聪明但是这个人很懒，什么也没有留下~')
            return
        default:
            if (question.includes('prompt') || question.includes('提示') || question.includes('背景知识')) {
                await room.say('你在说啥')
                return
            } else if (question.includes('发个图') || question.includes('屌图') || question.includes('发图') || question.includes('弔图')) {
                const fileName = getRandomEle(diaotu)
                await room.say(FileBox.fromFile(`src/assets/diaotu/${fileName}`))
                return
            } else if (question.includes('弱智')) {
                await room.say(getRandomEle(repoRuozhi))
                return
            } else if ((roomName == 'ZJU-2024-广东浙大群' || roomName == '糟糕！被饭桶包围了') && question.match(/([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师的([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)怎么样/)) {
                // ask
                const matchRes = question.match(/([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师的([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)怎么样/);
                const teacher = matchRes[1];
                const className = matchRes[2];
                const response = await searchCurriculum(teacher, className);
                console.log(response)
                await room.say(response)
                return
            } else if ((roomName == 'ZJU-2024-广东浙大群' || roomName == '糟糕！被饭桶包围了') && question.match(/([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师怎么样/)) {
                // ask
                const matchRes = question.match(/([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师怎么样/);
                const teacher = matchRes[1];
                const response = await searchCurriculum(teacher, null);
                console.log(response)
                await room.say(response)
                return
            } else if ((roomName == 'ZJU-2024-广东浙大群' || roomName == '糟糕！被饭桶包围了') && question.match(/锐评([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师：([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)/)) {
                // insert
                const matchRes = question.match(/锐评([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师：([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)/);
                const teacher = matchRes[1];
                const content = matchRes[2];
                updateCurriculum(teacher, null, content, talker.name())
                await room.say('done')
                return
            } else if ((roomName == 'ZJU-2024-广东浙大群' || roomName == '糟糕！被饭桶包围了') && question.match(/锐评([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师的([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)：([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)/)) {
                // insert
                const matchRes = question.match(/锐评([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)老师的([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)：([[\u4e00-\u9fa5a-zA-Z!@#$%^&*()]+)/);
                const teacher = matchRes[1];
                const className = matchRes[2];
                const content = matchRes[3];
                updateCurriculum(teacher, className, content, talker.name())
                await room.say('done')
                return
            } else if (question.length < questionMinLength) {
                await room.say(getRandomEle(repoBullshit))
                return
            }
            const randomNum = Math.random()
            // 如果问题太长就不走llm了
            if (question.length < questionMaxLength && (question.startsWith('boy') || !isLastLLM || randomNum < llmProbs)) {
                isLastLLM = true
                await room.say(await aibot(question, roomName, talker.name()))
            } else {
                isLastLLM = false
                await room.say(getRandomEle(repoBullshit))
            }
            break

    }
    return
}

let msgCount = {}
export async function defaultMessage(msg, bot, ServiceType = 'GPT') {
    const getReply = getServe(ServiceType)
    const contact = msg.talker() // 发消息人
    const receiver = msg.to() // 消息接收人
    var content = msg.text() // 消息内容
    const isQuote = content.includes('- - - - - - - - - - - - - - -')
    const room = msg.room() // 是否是群消息
    const roomName = (await room?.topic()) || null // 群名称
    const alias = (await contact.alias()) || (await contact.name()) // 发消息人的通讯录备注/昵称(不是群昵称)
    const remarkName = await contact.alias() // 备注名称
    const name = await contact.name() // 微信名称
    const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
    const isEmotion = msg.type() === bot.Message.Type.Emoticon // 消息类型是否为表情
    const isRoom = roomWhiteList.includes(roomName)  // 是否在群聊白名单内
    const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
    const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己
    if (isRoom) {
        if (msgCount[roomName]) msgCount[roomName]++;
        else msgCount[roomName] = 1
        // console.log('msg', roomName, msgCount[roomName])
    }
    // TODO 你们可以根据自己的需求修改这里的逻辑
    if (isBotSelf) return // 如果是机器人自己发送的消息或者消息类型不是文本则不处理
    try {
        // 区分群聊和私聊
        if (isRoom && room) {
            // if (msgCount[roomName] == numMsgGuide) {
            //   msgCount[roomName] = 1;
            //   await room.say(`[每${numMsgGuide}条消息自动推送] 不会还有新生没看新生指南吧？[旺柴][旺柴][旺柴]:https://zjuers.com/welcome`)
            // }
            if (isQuote) {//是回复
                content = content.split('- - - - - - - - - - - - - - -\n')[1] //获取回复的内容
            }
            // 微信的艾特后面是一个特殊符号，不是普通空格
            const isMention = content.startsWith(botName + ' ') // 是否艾特了机器人
            // a bug in the lib, not usable
            // const isMention = await msg.mentionSelf() // 是否艾特了机器人
            //查找是否包含所需的前缀,如[bot],@bot等
            if (!isMention || isEmotion) {
                autoReply(isRoom, content, room, contact, msg)
                return;
            }
            // 屏蔽yy
            if (contact.name() == '歪方') {
                await room.say('狗叫什么啊你')
                return
            }
            const question = content.replace(`${botName} `, '') // 去掉艾特的消息主体
            //随机数
            const timeout = 500 + Math.floor(Math.random() * 1000)
            await new Promise(resolve => setTimeout(resolve, timeout));//随机延迟
            await handleCommands(question, room, getReply, contact)
            // msgCount[roomName]++

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
