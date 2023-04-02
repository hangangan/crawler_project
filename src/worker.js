const spider = require("./spider");
const fs = require("fs");

process.on("message", (params) => {
    let num = 0;
    const pageNum = 1;
    const maxPageStart = params[2] * 1 -1;

  while (pageNum * (num + params[0]) <= maxPageStart) {
    let pageStart = pageNum * (num + params[0]);
    (async () => {
      let res = await spider(pageStart);
      for (let item of res) {
        fs.appendFileSync(
          "./src/assets/text.txt",
          `
        ${item?.title},
        ${item?.time},
        ${item?.href},
        ${item?.content}
        `
        );
      }
      process.send(`子进程 ${process.pid} 成功爬取河海新闻第${pageStart+1}页数据`);
    })();

    num += params[1];
  }
});
