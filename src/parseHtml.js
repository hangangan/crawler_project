const parseHtml = (htmlStr)=>{
    // 获取新闻标签
    let newsStr =htmlStr?.match(/\<div class\=\"col_news_list listcon\"\>([\s|\S]*?)\<\/ul\>/)[1]
    // 获取标题
    let titleArr = newsStr?.match(/title='(\S*?)'/g)
    // 获取链接
    let hrefArr = newsStr?.match(/href='(\S*?)'/g)
    let hrefArr1 = []
    for(let item of hrefArr){
        hrefArr1.push('https://www.hhu.edu.cn/'+item?.substring(7,item.length-1))
    }
    // 获取时间
    let timeArr = newsStr?.match(/\<span class="news_meta"\>([\s|\S]*?)\<\/span\>/g)
    let timeArr1 = []
    for(let item of timeArr){
        timeArr1.push("time=\'"+item?.substring(24,item.length-7)+"\'")
    }
    // 转为对象形式
    let newsObj = []
    for(let i=0;i<timeArr.length;i++){
        newsObj.push({
            title:titleArr[i],
            href:hrefArr1[i],
            time:timeArr1[i]
        })
    }
    return newsObj
}

function parseNewsHtml(str){
    let content = str?.match(/<meta name="description" content="([\s\S]*?)\/>/)[0]
    content = content?.substring(33,content.length-2)
    return content
}

module.exports = {
    parseHtml,
    parseNewsHtml
}