import requests
from bs4 import BeautifulSoup
import json
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
}

# gets links thru home page


def getLinks():
    return requests.get(url="http://web.archive.org/web/20080920184404/http://blog.nbc.com/CreedThoughts/", headers=headers).text

# gets post body given post URL


def getPost(link):
    body = requests.get(url=link, headers=headers).text
    soup = BeautifulSoup(body, "html.parser")
    if soup.find(class_="entry-more-link"):
        print("---FOUND POST WITH READ MORE LINK---")
        readLink = soup.find(class_="entry-more-link")
        body = requests.get(url=readLink.a.get("href"), headers=headers).text
    return body

# returns list of links


def linkScraper(body):
    soup = BeautifulSoup(body, "html.parser")
    htmlList = soup.find_all(id="blog-col-inner")
    soup = BeautifulSoup(str(htmlList[1]), "html.parser")
    linkList = []
    for link in soup.find_all("a"):
        linkList.append(link.get("href"))
    return linkList

# returns object with post data


# def verifyLinks(linkList):


def postScraper(body):
    soup = BeautifulSoup(body, "html.parser")
    postDiv = soup.find(class_="blog-post1")
    soup = BeautifulSoup(str(postDiv), "html.parser")
    date = soup.find("strong").text.split(", ")
    dateObj = {
        "date": date[0],
        "time": date[1]
    }
    post = ""
    content = soup.find_all("p")
    content.pop(0)
    counter = 0
    while counter <= len(content):
        if (counter == len(content) - 1):
            post += content[counter].text
            break
        post += content[counter].text
        post += "\n\n"
        counter += 1
    return {
        "date": dateObj,
        "content": post
    }


def write(posts):
    with open('thoughts.json', 'w') as file:
        json.dump(posts, file)


def run():
    body = getLinks()
    links = linkScraper(body)
    posts = []
    for link in links:
        print("ACCESSING: ", link)
        body = getPost(link)
        scrapePost = postScraper(body)
        posts.append(scrapePost)
        print("SCRAPED! moving on...")
    write(posts)
    print("\nCHECK FILE!")
    return posts
    # getPost("http://web.archive.org/web/20080914170457/http://blog.nbc.com/CreedThoughts/2008/02/24-week/#more")


run()
