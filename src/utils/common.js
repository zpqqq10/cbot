import fs from 'fs';

export const getRandomEle = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

// length: the length of the array
// count: the number of random indexes you want to get
export const getRandomIndex = (length, count = 5) => {
    const res = [];
    while (res.length < count) {
        const randomIndex = Math.floor(Math.random() * length);
        if (!res.includes(randomIndex)) {
            res.push(randomIndex);
        }
    }
    return res;
}

export const searchCurriculum = async (teacher, className) => {
    const data = fs.readFileSync('src/assets/curriculum.json')

    const json = JSON.parse(data);
    if (json[teacher]) {
        if (className != null) {
            if (json[teacher][className]) {
                if (json[teacher][className].length > 5) {
                    // constrain the number of evaluations to 5
                    const indices = getRandomIndex(json[teacher][className].length);
                    var res = '';
                    indices.forEach(index => {
                        res += json[teacher][className][index]['evaluation'] + '\n';
                        // res += json[teacher][className][index]['evaluation'] + '----' + json[teacher][className][index]['date'] + '\n';
                    });
                    return res;
                } else {
                    console.log(json[teacher][className]);
                    return json[teacher][className].map(ele => ele['evaluation']).join('\n');
                    // return json[teacher][className].map(ele => ele['evaluation'] + '----' + ele['date']).join('\n');
                }
            } else {
                return `没有人点评过${teacher}老师的${className}`;
            }
        } else if (json[teacher]['overall']) {
            if (json[teacher]['overall'].length > 5) {
                // constrain the number of evaluations to 5
                const indices = getRandomIndex(json[teacher]['overall'].length);
                var res = '';
                indices.forEach(index => {
                    res += json[teacher]['overall'][index]['evaluation'] + '\n';
                    // res += json[teacher]['overall'][index]['evaluation'] + '----' + json[teacher]['overall'][index]['date'] + '\n';
                });
                console.log({ indices, res });
                return res;
            } else {
                return json[teacher]['overall'].map(ele => ele['evaluation']).join('\n');
                // return json[teacher]['overall'].map(ele => ele['evaluation'] + '----' + ele['date']).join('\n');
            }
        } else {
            return '没人评价过这个老师，但是有人评价过这个老师的课程';
        }
    } else {
        return '没这个老师啊';
    }
};

export const updateCurriculum = async (teacher, className, content, commentator) => {
    const data = fs.readFileSync('src/assets/curriculum.json')

    const json = JSON.parse(data);
    const d = new Date();
    const dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    const jsonkey = className ? className : 'overall';
    // insert to json
    if (!json[teacher]) {
        // create new one
        json[teacher] = {}
        json[teacher][jsonkey] = [{
            'date': dateStr,
            'evaluation': content,
            'from': commentator,
            'date': dateStr
        }]
    } else if (!json[teacher][jsonkey]) {
        // create new one
        json[teacher][jsonkey] = [{
            'date': dateStr,
            'evaluation': content,
            'from': commentator,
            'date': dateStr
        }];
    } else {
        // insert one
        json[teacher][jsonkey].push({
            'date': dateStr,
            'evaluation': content,
            'from': commentator,
            'date': dateStr
        });
    }

    fs.writeFile('src/assets/curriculum.json', JSON.stringify(json), function (err) {
        if (err) {
            console.error(err);
            return '更新失败';
        }
        return '更新成功';
    });
}

export const lyricsSolitaire = (word) => {
    switch (word) {
        case '哔嘟哔嘟':
            return '男同集合';
        case '雨一直下':
            return '气氛不算融洽';
        case '雨下整夜':
        case '整夜':
            return '我的爱溢出就像雨水';
        case '院子落叶':
            return '跟我的思念厚厚一叠';
        case '几句是非':
            return '也无法将我的热情冷却';
        case '窗台蝴蝶':
            return '像诗里纷飞的美丽章节'
        case '我接着写':
            return '把永远爱你写进诗的结尾'
        case '在雨中漫步':
            return '蓝色街灯渐露';
        case '差不多冬至':
            return '一早一晚还是有雨';
        case '听一千遍反方向的钟':
            return '能不能回到过去爱你的时空';
        case '听说现在的你':
            return '成了大锦鲤~';
        case '十点半的飞机快要到了':
            return '机场还是那么的拥挤';
        case '听雨的声音':
            return '一滴滴清晰';
        case '雨后的城市':
            return '寂寞又狼狈';
        case '刮风这天':
            return '我试过握着你手';
        case '但偏偏雨渐渐':
            return '大到我看你不见';
        case '还要多久':
            return '我才能在你身边';
        case '等到放晴的那天':
            return '也许我会比较好一点';
        case '最美的不是下雨天':
            return '是曾与你躲过雨的屋檐';
        case '从来未爱你':
            return '绵绵';
        case '可惜我爱怀念':
            return '尤其是代我伤心的唱片';
        case '谁能体谅我的雨天':
            return '所以情愿回你身边';
        case '怪就怪天气':
            return '像曾哭过的旧电影';
        case '原来一回头':
            return '原来才显出你温柔';
        case '不应该记起':
            return '何必偏偏记起';
        case '我没有为你伤春悲秋不配有憾事':
            return '你没有共我踏过万里不够剧情延续故事'
        case '头发未染霜':
            return '着凉亦错在我幼稚';
        case '为何出现在彼此的生活又离开':
            return '只留下在心里深深浅浅的表白';
        case '如果这都不算爱':
            return '我有什么好悲哀';
        case '虽然她送了我玫瑰花':
            return '但昨晚我真的没睡她';
        case '只知道感觉失了踪':
            return '不知道恋爱这么重';
        case '暧昧让人受尽委屈':
            return '找不到相爱的证据';
        case '闭上眼看十六岁的夕阳':
            return '美得像我们一样';
        case '边走边唱天真浪漫勇敢':
            return '以为能走到远方';
        case '我们曾相爱':
            return '想到就心酸';
        case '我哪有说谎':
            return '请别以为你有多难忘';
        case '一个人失眠':
            return '全世界失眠';
        case '无辜的街灯':
            return '守候明天';
        case '幸福的失眠':
            return '只是因为害怕闭上眼~';
        case '如何想你想到六点':
            return '如何爱你爱到终点';
        case '多想要向过去告别':
            return '当季节不停更迭';
        case '却还是少一点坚决':
            return '在这寂寞的季节~';
        case '苦海':
            return '翻起爱恨';
        case '在世间':
            return '难逃避命运';
        case '相亲':
            return '竟不可接近';
        case '或我应该':
            return '相信是缘分';
        case '第一':
            return '绝对不意气用事';
        case '第二':
            return '绝对不漏判任何一件坏事';
        case '第三':
            return '绝对裁判的公正漂亮！';
        case '那时我':
            return '想念想得雨滂沱';
        case '湿透了':
            return '昨夜的梦';
        case '如果梦':
            return '诉说着灵魂的寄托';
        case '你会不会':
            return '还想着我 还想着我';
        case '爱情来得太快就像龙卷风':
            return '离不开暴风圈来不及逃';
        case '我不能再想':
            return '我不能再想';
        case '爱情走的太快就像龙卷风':
            return '不能承受我已无处可躲';
        case '爱像一阵风':
            return '吹完它就走';
        case '这样的节奏':
            return '谁都无可奈何';
        case '信什么如来':
            return '不如我自己来！';
        case '天花塌下':
            return '还在祝福他跟你数羊';
        case '胸襟够吧':
            return '凭什么洒脱自弹自唱';
        case '铃声切记关掉':
            return '明天见也最好不要';
        case '就当泪腺失调':
            return '早渗入记↑忆↑ 你怪不了';
        case '失恋唱情歌':
            return '即係漏煤气关窗';
        case '第一次去卢浮宫':
            return '并没有什么特别感觉';
        case '因为独属于我的蒙娜丽莎':
            return '我早已遇见';
        case '初次遇见你的那天':
            return '齿轮开始转动';
        case '无法停止失去的预感':
            return 'Can you give me one last kiss?';
        case 'oh oh oh oh oh':
            return 'oh oh oh oh oh';
        case '我以为我早想清楚':
            return '不由自主恍恍惚惚又走回头路';
        case '再看一眼有过的':
            return '幸福';
        case '爱情好像流沙':
            return '我不挣扎';
        case '随它去吧':
            return '我不害怕';
        case '我会发着呆然后忘记你':
            return '接着紧紧闭上眼';
        case '想着哪一天':
            return '会有人代替';
        case '你应该清楚':
            return '对爱情谁越不在乎越不会输';
        case '有时候有时候':
            return '我会相信一切有尽头';
        case '相聚离开':
            return '都有时候';
        case '没有什么会':
            return '永垂不朽';
        case '可是我有时候':
            return '宁愿选择留恋不放手';
        case '等到风景都看透':
            return '也许你会 陪我看细水长流';
        case '在':
            return '哪里记载第一个桃花贼';
        case '谁在':
            return '哪里典卖第一支紫玉钗';
        case '你哭起来我笑起来':
            return '都为了爱 爱 爱';
        case '有一天翻开辞海找不到':
            return '花不开树不摆还是更畅快';
        case '发现你我':
            return '傻眼工作';
        case '擦肩而过':
            return '大家时间不多';
        case '为了未来':
            return '没了对白';
        case '毁了最爱':
            return '追不回来';
        case '徘徊在似苦又甜之间':
            return '望不穿这暧昧的眼';
        case '强而有力！':
            return '强而有力啊！';
        case '忘记你的好必需斗气':
            return '忘记你的狠必需志气';
        case '忘记了哭泣':
            return '只因太错愕为何不一起';
        case '忘记了开始想起结尾':
            return '忘记甜蜜却又想憎你';
        case '维持着熟悉表情陌生关系不要变':
            return '只等到红白仪式一场偶遇才会面';
        case '而你心房的新房客':
            return '陪你欣赏夕阳的金黄色';
        case '除非你是我':
            return '才可与我常在';
        case '一个人':
            return '从镜内发展恩爱';
        case '一月的烟雨飘摇的南方':
        case '二月的烟雨飘摇的南方':
        case '三月的烟雨飘摇的南方':
        case '四月的烟雨飘摇的南方':
        case '五月的烟雨飘摇的南方':
        case '六月的烟雨飘摇的南方':
        case '七月的烟雨飘摇的南方':
        case '八月的烟雨飘摇的南方':
        case '九月的烟雨飘摇的南方':
        case '十月的烟雨飘摇的南方':
        case '十一月的烟雨飘摇的南方':
        case '十二月的烟雨飘摇的南方':
            return '你坐在你空空的米店';
        case '无须要快乐':
            return '反正你一早就哭死';
        case '如果有眼泪':
            return '只不过生理分泌';
        case '从未来再见':
            return '遗憾旧时不太会恋爱';
        case '愿我永远记不得':
            return '我正身处现在';
        case '再见':
            return '仍旧未能跟你再恋爱';
        case '多意外':
            return '在日落大道的你与我握手';
        case '轻轻说':
            return '你发觉太想闯遍这地球';
        case '为何恋爱可以当做吸过半支烟':
            return '随时不太高兴将那烟蒂放一边';
        case '为何分手可以当做将细软搬迁':
        case '为何分手可以当做将誓愿搬迁':
            return '临行给我一句失去感觉我的天';
        case '亲':
            return '多么的清楚我内心';
        case '我的亲':
            return '知否此刻一对灵魂终相认了';
        case '北风毫不留情':
            return '把叶子吹落';
        case '我从来没想过':
            return '我会这样做';
        case '从来没爱过':
            return '所以爱错';
        case '我从哪里起飞':
            return '从哪里降落';
        case '多少不能原谅的错':
            return '却不能重来过';
        case '还记得樱花正开':
            return '还未懂跟你示爱';
        case '如有天樱花再开':
            return '期望可跟你示爱';
        case '明日花':
            return '昨日已开';
        case '我是一个临记可以填满你寂寞':
            return '姑息你滥用我弥补这空档';
        case '叶师父可唔可以收我为徒':
            return '黐线 驶开啦肥仔';
        case '仍然没有遇到':
            return '那位跟我绝配的恋人';
        case '忘掉种过的花':
            return '重新的出发 放弃理想吧';
        case '当这世界已经准备将我遗弃':
            return '像一个伤兵被留在孤独荒野里';
        case '情人总分分合合':
            return '可是我们却没有人爱';
        case '这无声的夜':
            return '现在的我 需要人陪';
        case '我们曾相爱':
            return '想到就心酸';
        case '我曾拥有你':
            return '真叫我心酸';
        case '至少我们中还有人能快乐':
            return '这样就已足够了';
        case '美好的沉淀了':
            return '没有火花不要烧';
        case '爱过的成熟了':
            return '犯错只因失恋太少';
        default:
            return '';
    }
}