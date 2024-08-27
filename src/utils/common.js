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
        case '苦海':
            return '翻起爱恨';
        case '在世间':
            return '难逃避命运';
        default:
            return '';
    }
}