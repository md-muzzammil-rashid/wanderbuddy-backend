import puppeteer from 'puppeteer'

const scrapeRestaurant = async (place) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // const url = `https://www.justdial.com/${place}/Restaurants/`
    const url = "https://www.tripadvisor.in/Search?q=ranchi&geo=662320&ssrc=e&searchNearby=false&searchSessionId=0019a31d469f15b7.ssid&blockRedirect=true&offset=0"
    console.log(url);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });
    
    console.log("going to page");
    await page.goto(url)
    console.log("page loaded");

    const restaurantList = [];
    const restaurantName = await page.evaluate(() => {
        console.log('evaluating restaurant');
        const restaurantElement = document.querySelectorAll('.BMQDV')
        restaurantElement.forEach(element=>{
            console.log("in element");
            element.classList.forEach(l=>console.log(l))
            // const restaurant = {
            //     link: element.querySelectorAll('img')[0].src
            // }
            const restaurant = element.textContent;
            restaurantList.push(restaurant)
        })
    })
    
    return restaurantList;
    await browser.close()

    // return restaurantName
}

export {
    scrapeRestaurant
}