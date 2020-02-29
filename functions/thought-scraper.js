var request = require("request-promise").defaults({
  resolveWithFullResponse: true,
  simple: false,
  headers: {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
  }
});
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getThoughts = async () => {
  try {
    var req = await request.get({
      uri:
        "http://web.archive.org/web/20080920184404/http://blog.nbc.com/CreedThoughts/"
    });
    if (req.statusCode !== 200) {
      console.error(`[${req.statusCode}] Bad Proxy`, req.body);
      throw new Error(`[${req.statusCode}] Bad Proxy`);
    }
    console.log("REQUEST WORKED!", req.statusCode);
    return req.body;
  } catch (error) {
    console.log("ERROR: ", error.message);
    throw error;
  }
};

const getPost = async link => {
  try {
    var req = await request.get({
      uri: link
    });
    if (req.statusCode !== 200) {
      console.error(`[${req.statusCode}] Bad Proxy`, req.body);
      throw new Error(`[${req.statusCode}] Bad Proxy`);
    }
    console.log("REQUEST WORKED!", req.statusCode);
    return req.body;
  } catch (error) {
    console.log("ERROR: ", error.message);
    throw error;
  }
};

const linkScraper = body => {
  const document = new JSDOM(body).window.document;
  let list = document.querySelectorAll("#blog-col-inner");
  let links = Array.from(list[1].children);
  const LINKS = [];
  links.pop();
  links.shift();
  links.forEach(link => {
    LINKS.push(link.children[0].children[0].href);
  });
  return LINKS;
};

const postScraper = body => {
  const window = new JSDOM(body, { pretendToBeVisual: true }).window;
  let document = window.document;
  console.log(body.includes("blog-post1"));
  let paragraphs = document.querySelector("div.blog-post1").children;
  // paragraphs.shift();
  // paragraphs.shift();
  console.log("PARAGRAPHS: ", paragraphs.item(0).innerHTML);
  let str = "";
  paragraphs.forEach(paragraph => {
    console.log(paragraph.innerText);
  });
  // for (var i = 0; i <= paragraphs.length; i++) {
  //   if (i === paragraphs.length - 1) {
  //     str += paragraphs[i].innerText;
  //     break;
  //   }
  //   str += paragraphs[i].innerText;
  //   str += "\n\n";
  // }
  return {
    content: str
  };
};

// make a function that calls postScraper with each link returned from linkScraper
// make a function in the db that adds a post to the thoughts collection (i think we already ahve this)
// make endpoint that will call all of this and populate db

const run = async () => {
  const body = await getThoughts();
  const links = await linkScraper(body);
  console.log("LINKS: ", links);
  const db = [];
  for (var i = 0; i < links.length; i++) {
    let post = await getPost(links[i]);
    let scrapedPost = await postScraper(post);
    console.log("SCRAPED POST: ", scrapedPost);
    db.push(scrapedPost);
  }
  console.log("DATABASE: ", db);
  return;
};

run();
