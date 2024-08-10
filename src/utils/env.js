import dotenv from 'dotenv'
export const env = dotenv.config().parsed // 环境参数
// 从环境变量中导入机器人的名称
export const botName = env.BOT_NAME
//触发机器人的前缀
export const prefixName = env.PREFIX ? env.PREFIX.split(',') : []
// 从环境变量中导入联系人白名单
export const aliasWhiteList = env.ALIAS_WHITELIST ? env.ALIAS_WHITELIST.split(',') : []

// 从环境变量中导入群聊白名单
export const roomWhiteList = env.ROOM_WHITELIST ? env.ROOM_WHITELIST.split(',') : []

export const tianKey = env.TIAN_KEY

export const replyTimeLimit = parseInt(env.REPLY_TIME_LIMIT) // 机器人回复时间限制
export const llmProbs= parseFloat(env.LLM_PROBS)// 机器人回复时间限制,double
export const questionMinLength = parseInt(env.QUESTION_MIN_LENGTH) // 问题最小长度
export const questionMaxLength = parseInt(env.QUESTION_MAX_LENGTH) // 问题最大长度
export const numMsgGuide=parseInt(env.NUM_MSG_GUIDE) //重复这么多消息时，触发新生指南
export default env;
// export default {botName,prefixName,aliasWhiteList,roomWhiteList,
//     tianKey,llmProbs,replyTimeLimit,
//     questionMinLength,questionMaxLength,
//     };