# douyin-danmu

## 说明

- 首先你需要使用chrome的调试模式，拿到ws地址，并修改config.js顶部的wsUrl变量为ws地址

- 你需要准备直播间的id，可以在url处拿到，比如<https://live.douyin.com/212606438033>，并填写到config.js顶部的wsUrl变量为ws地址

- 有两个端，一个pupputeer的客户端，负者爬取数据，另一个ws服务端，负责收集数据

### 启动

npm start 或者 nodemon ./server.js

然后

npm run start:puppeteer 或者 node ./douyin.js

## 待优化

- 包含图片的昵称和弹幕 未格式化
- 送礼的逻辑
