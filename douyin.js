const puppeteer = require("puppeteer");
const WebSocket = require("ws");
const { roomId, wsUrl } = require("./config");

(async function () {
  const url = new URL(wsUrl);
  url.searchParams.set("stealth", "true");
  // url.searchParams.set("headLess", "false");
  url.searchParams.set("timeout", "600000");
  url.searchParams.set("--disable-notifications", "true");
  url.searchParams.set("--disable-dev-shm-usage", "true");

  const browser = await puppeteer.connect({
    browserWSEndpoint: url.toString(),
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600, deviceScaleFactor: 1 });
  await page.goto(`https://live.douyin.com/${roomId}`);

  // const text = await page.$eval(".tLpX23X1", (el) => el.innerHTML);
  const roomClass = ".webcast-chatroom___items>div:first-child";
  const bottomMsgClass = ".webcast-chatroom___bottom-message";

  await page.waitForSelector(roomClass);
  await page.waitForSelector(bottomMsgClass);
  await page.evaluate(
    ({ bottomMsgClass, roomClass }) => {
      // 谷歌环境
      window.socket = new WebSocket("ws://127.0.0.1:8080");

      socket.onopen = function (event) {
        console.log("WebSocket连接已打开。");
      };

      socket.onclose = function (event) {
        console.log("WebSocket连接已关闭。onclose", event);
        window.socket = null;
      };

      socket.onmessage = function (event) {
        console.log("收到消息：" + event.data);
      };
      socket.onerror = function (e) {
        console.log("error", e);
      };
      const btmMsgEl = document.querySelector(bottomMsgClass);
      const chatroom = document.querySelector(roomClass);

      //   来了监听
      btmMsgEl.addEventListener(
        "DOMSubtreeModified",
        function (e) {
          if (e.target.nodeType === 3) {
            console.log(e.target.nodeValue);
            socket &&
              socket.send(
                JSON.stringify({
                  type: "来了",
                  data: e.target.nodeValue,
                })
              );
          }
        },
        false
      );
      // 聊天监听

      const handleListenChange = (mutationsList, observer) => {
        const newDom = mutationsList[0].addedNodes[0];
        console.log("newDom: ", newDom);
        if (!newDom) return;
        const mUQC4JAd = newDom.querySelector(".mUQC4JAd");
        if (mUQC4JAd) {
          // const span1 = mUQC4JAd.querySelector("span:nth-child(1)");
          const span2 = mUQC4JAd.querySelector("span:nth-child(2)");
          const span3 = mUQC4JAd.querySelector(
            "span:nth-child(3) .webcast-chatroom___content-with-emoji-text"
          );

          const data = {
            username: span2.innerHTML || "",
            content: span3.innerHTML || "",
            type: "chatroom-message",
          };

          console.log(data);
          socket && socket.send(JSON.stringify(data));
        }
      };
      const mutationObserver = new MutationObserver(handleListenChange);

      mutationObserver.observe(chatroom, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    },
    { bottomMsgClass, roomClass }
  );
  console.log("客户端已准备就绪！");
})();
