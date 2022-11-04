const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the page', () => {
  it('should contain a heading at the top of the page', async () => {
      var headings = await page.$$('body > h1:first-child');
      expect(headings.length).toBe(1);
  });
});

describe('the page heading', () => {
  it('should have the id page-heading', async () => {
      var headings = await page.$$('body > h1:first-child[id="page-heading"]');
      expect(headings.length).toBe(1);
  });
});

describe('the page heading', () => {
  it('should contain the text Task Board', async () => {
      var heading = await page.$eval('#page-heading', (heading) => {
        return heading.innerHTML.trim();
      });
      expect(heading).toBe('Task Board');
  });
});
