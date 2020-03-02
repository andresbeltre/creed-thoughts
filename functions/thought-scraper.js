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
  const document = new JSDOM(body).window.document;

  //Getting the date of the Post
  // let date = document.querySelector("div.blog-post1 p:nth-child(1) strong")
  //   .text;
  // const DATE = {
  //   date: date.split(", ")[0],
  //   time: date.split(", ")[1]
  // };

  //Getting the content of the post
  let postHTMLCollection = document.querySelector("div.blog-post1").children;
  let paragraphArray = [].slice.call(postHTMLCollection);
  paragraphArray.shift();
  paragraphArray.shift();

  const lastP = paragraphArray.length - 1;

  let str = "";

  //checks if there is a 'more' link that links to full post
  if (paragraphArray[lastP].innerHTML.includes("Creed Thoughts")) {
    let moreLink = document.querySelector("div.blog-post1 p a").href;

    /*
    How do we want to deal wit the post that have a link to the full post.
    I think we should split this function into smaller functions (MAYBE WE DONT NEED IT:
      - A function to get check if the post has a more link:
        if more link exist
          feed the link to function that returns the HTMLCollection of P tags
          then finsh processing in this function (putting all of the P tags into a single paragraph)
        else
          finsh processing in this function (putting all of the P tags into a single paragraph)
    
      */
  }

  for (var i = 0; i <= paragraphArray.length; i++) {
    if (i === paragraphArray.length - 1) {
      str += paragraphArray[i].innerHTML;
      break;
    }
    str += paragraphArray[i].innerHTML;
    str += "\n\n";
  }

  let post = {
    content: str
  };

  return post;
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
