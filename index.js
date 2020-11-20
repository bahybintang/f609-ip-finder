const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

const IP_CHECK_URL = "https://api.ipify.org?format=json";
const { USERNAME, PASSWORD, TARGET_IP, URL } = require("./config");

const restartRouter = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  await page.type("#Frm_Username", USERNAME);
  await page.type("#Frm_Password", PASSWORD);
  await page.click("#LoginId");
  await page.waitForNavigation();

  const frame = await page.frames().find((f) => f.name() === "mainFrame");
  await frame.click("#mmManager");
  await frame.waitForNavigation();
  await frame.click("#smSysMgr");
  await frame.waitForNavigation();
  await frame.click("#Submit1");
  await frame.click("#msgconfirmb");
  await page.waitForNavigation();
  await browser.close();
};

const checkIp = async () => {
  const res = await fetch(IP_CHECK_URL);
  const data = await res.json();
  console.log("Current IP: ", data.ip);
  return TARGET_IP.test(data.ip);
};

const start = async () => {
  let counter = 1;
  let ipFound = false;
  do {
    let retry = true;
    console.log(`Trying (${counter++})...`);
    await restartRouter();
    do {
      try {
        ipFound = await checkIp();
        retry = false;
      } catch (e) {}
    } while (retry);
  } while (!ipFound);
  console.log("IP found!");
};

start();
