/**
 * This bot basically displays current value of aqua price on your discord bot every 60 seconds.
 */

require('dotenv').config();
const puppeteer = require('puppeteer');
const { Client, Intents } = require('discord.js');

console.log('start...');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const AQUA_WEB_URL = 'https://red.planetfinance.io';

async function fetchAquaPrice(browser) {
  const page = await browser.newPage();
  await page.goto(AQUA_WEB_URL);

  // To load planet finance web page full to retrive data. Other wise it will return 0 dolar.
  await page.waitForTimeout(8000);

  const selector = await page.waitForSelector('a[class~="sc-kDThTU"]');
  const value = await selector.evaluate((el) => el.textContent);

  browser.close();

  return value;
}

client.on('ready', async () => {
  const browser = await puppeteer.launch({
    headless: process.platform !== 'darwin',
    args: ['--no-sandbox'],
  });

  setInterval(async () => {
    const aquaValue = await fetchAquaPrice(browser);

    client.user.setActivity(`${aquaValue}`, { type: 'WATCHING' });
  }, 60000); // Runs this every 60 seconds.
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
