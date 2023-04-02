const superagent = require("superagent");
const { parseHtml, parseNewsHtml } = require("./parseHtml");
const api = "https://www.hhu.edu.cn/hhxw/";

module.exports = async (pageStart) => {
  return new Promise((resolve, reject) => {
    // 获取河海新闻第pageStart页数据
    superagent
      .get(
        api + (pageStart + 1 === 1 ? `list.htm` : `list${pageStart + 1}.htm`)
      )
      .end((err, res) => {
        if (err) reject(err);
        let resObj = res.text;
        // 结果输出
        // console.log('获取到数据'+resObj);
        resolve(resObj);
      });
  })
    .then((res) => {
      // 转为news对象
      const newsObj = parseHtml(res);
      return newsObj;
    })
    .then((res) => {
      // 获取每条news的内容
      let news = [];
      let promiseArr = []
      res.forEach((item,index) => {
        if(!item.href) return
        promiseArr.push(new Promise((resolve, reject) => {
            superagent.get(item.href).end((err, res) => {
              if (err) reject(err);
              let newsStr = res?.text;
              let newsContent = parseNewsHtml(newsStr);
              resolve(newsContent);
            });
          })
          .then(res=>{
              news[index] = {...item,content:res}
          })
          .catch(err=>{
            console.log(err)
          }))
      });
      return Promise.all(promiseArr).then(()=>{
        return news
      }).catch(err=>{
        console.log(err)
      })
    });
};
