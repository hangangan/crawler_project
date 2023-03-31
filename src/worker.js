const spider = require('./spider')
const fs = require('fs')

process.on('message', (params) => {
    let num = 0;
    const pageNum = 20;
    const maxPageStart = params[2] * 20 -1;

    while (pageNum * (num + params[0]) <= maxPageStart) {
        let pageStart = pageNum * (num + params[0]);

        (async () => {
            const res = await spider(pageStart);
            fs.readFile('./src/assets/text.txt','utf8',(err,data)=>{
                if(err){
                    console.log(err)
                } else {
                    fs.writeFileSync('./src/assets/text.txt',data+'\n'+JSON.stringify(res)+'\n')
                }
            })
            process.send(`子进程 ${process.pid} 成功爬取日本动画第${(pageStart + 20) / 20}页数据`);
        })();

        num += params[1];
    }
});