import axios from 'axios'
import {tianKey} from './env.js'
//导入心语api



export async function zaoan() {
    const url = `https://apis.tianapi.com/zaoan/index`
    //设置header
    const config = {
        params: { key: tianKey },
        headers: {
            // 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
            // 'Content-Length': '35',
            // 'Content-Type': 'application/x-www-form-urlencoded', // 设置Content-Type
        },
        timeout: 5000
    };
    try {
        const response = await axios.get(url, config)
        if (response.data.code === 200) {
            // 解析JSON数据
            const content = response.data.result.content
            // 拼接字符串
            const date = new Intl.DateTimeFormat('zh-u-ca-chinese', { dateStyle: 'full' }).format(new Date()).slice(4)

            const result = `早安吉祥！\[烟花\]/玫瑰/玫瑰/抱拳/抱拳\[烟花\]\n ${content} \n ${date} 【共勉】`;
            // console.log(result);
            return result;
        } else if (response.data.code == 150) {
            return '没钱了，v我50'
        } else {
            return '出错了，别用了亲'
        }
    } catch (e) {
        console.log(e)
        // 处理请求错误
        return '出错了，别用了亲'
    }
}

export async function wangyiyun() {
    const url = `https://apis.tianapi.com/hotreview/index`
    //设置header
    const config = {
        params: { key: tianKey },
        timeout: 5000
    };
    try {
        const response = await axios.get(url, config)
        if (response.data.code === 200) {
            // 解析JSON数据
            const content = response.data.result.content
            return content;
        } else if (response.data.code == 150) {
            return '没钱了，v我50'
        } else {
            return '出错了，别用了亲'
        }
    } catch (e) {
        console.log(e)
        // 处理请求错误
        return '出错了，别用了亲'
    }
}

export async function hitokoto(type) {
    const url = `https://v1.hitokoto.cn/?encode=json&c=${type}`
    try {
        const response = await axios.get(url)
        if (response.status === 200) {
            // 解析JSON数据
            const hitokoto = response.data.hitokoto
            const from = response.data.from;
            const from_who = response.data.from_who;
            // 拼接字符串
            const result = `${hitokoto}\n ——《${from}》${from_who || ''}\n来自一言API`;
            // console.log(result);
            return result;
        } else {
            return 'Failed to fetch data.'
        }
    } catch (e) {
        // 处理请求错误
        return 'Failed to fetch data.'
    }
}

export async function help(){
    return `
        可用命令列表：
        - 新生指引：获取浙江大学新生指引链接。
        - 24点：获取一组随机数字，用于24点游戏。
        - 早安心语：获取早安问候语。
        - 开e!：获取网易云音乐的随机热评。
        - 动漫一言：获取动漫中的随机名言。
        - 小说一言：获取小说中的随机名言。
        - 诗词一言：获取诗词中的随机名言。
        - 发疯：获取随机的疯狂语句。
        - 帮助: 获取帮助信息。
        - 除了这些关键字之外，会调用大模型来回答：有一定概率将获得随机回复，否则为大模型回答。
    `;
      
}