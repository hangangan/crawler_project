const cluster = require("cluster");
const cpuNums = require("os").cpus().length;
const fs = require("fs");

cluster.setupMaster({
  exec: "./src/worker.js",
  args: ["--use", "http"],
});

console.log(`一共开启${cpuNums}个子进程来进行爬取`);

let pageNum = 5;
const startTime = Date.now();

fs.writeFileSync("./src/assets/text.txt", "");

for (let i = 0; i < cpuNums; ++i) {
  let work = cluster.fork();

  // 抓取前cpuNums页数据
  work.send([i, cpuNums, pageNum]);

  // 当接收到进程的响应时说明进程已经完成一页数据的抓取
  work.on("message", (msg) => {
    console.log(msg);

    pageNum--;
    if (pageNum === 0) {
      console.log(`\n已完成所有爬取， using ${Date.now() - startTime} ms\n`);
      console.log("接下来关闭各子进程:\n");
      cluster.disconnect();
    }
  });
}

cluster.on("fork", (worker) => {
  console.log(`[master] : fork worker ${worker.id}\n`);
});

cluster.on("exit", (worker) => {
  console.log(`[master] : 子进程 ${worker.id} 被关闭`);
});
