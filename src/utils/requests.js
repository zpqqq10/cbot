import axios from 'axios'
import env from './env.js'
//导入心语api
const tianKey = env.TIAN_KEY


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
            const date = new Intl.DateTimeFormat('zh-u-ca-chinese', { dateStyle: 'long' }).format(new Date())

            const result = `早安心语！\n ${content} \n ${date} 【共勉】`;
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