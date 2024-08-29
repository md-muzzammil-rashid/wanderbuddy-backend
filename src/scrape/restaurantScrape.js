import puppeteer from 'puppeteer'

const scrapeRestaurant = async (place) => {
    const delay = ms => new Promise(resolve=> setTimeout(resolve, ms))

    const browser = await puppeteer.launch({
        headless: false, // Run in full browser mode
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
        ],
})
    const page = await browser.newPage()
    // const url = `https://www.justdial.com/${place}/Restaurants/`
    const url = `https://www.tripadvisor.in/Search?q=${place}&ssrc=e`
    console.log(url);
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    // await page.setExtraHTTPHeaders({
    //   'Accept-Language': 'en-US,en;q=0.9',
    // });
    
    console.log("going to page");
    await page.goto(url, {waitUntil:'networkidle2'})
    console.log("page loaded");
    await delay(2000)
    await page.waitForSelector(".kgrOn")
    const restaurantList = await page.evaluate(() => {
        console.log('evaluating restaurant');
        const restaurants = []

        const restaurantElementSelectors = document.querySelectorAll('.kgrOn')
        restaurantElementSelectors.forEach(restaurantElement=>{
            const restaurantImage = restaurantElement.querySelector("img")?.src || "";
            
            const restaurantName = restaurantElement.querySelectorAll("a")[2]?.innerText || "";
            const restaurantLink = restaurantElement.querySelectorAll("a")[2]?.href || "";

            restaurants.push({restaurantImage, restaurantName, restaurantLink})
        })
        return restaurants;
    })
    
    await browser.close()
    return restaurantList;

    // return restaurantName
}

export {
    scrapeRestaurant
}