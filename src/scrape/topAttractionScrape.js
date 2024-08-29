import puppeteer from 'puppeteer'

const scrapeTopAttractions = async (place) => {
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
    const url = `https://www.tripadvisor.in/TravelersChoice-ThingsToDo-cTopAttractions-g1`
    console.log(url);

    console.log("going to page");
    await page.goto(url, {waitUntil:'networkidle2'})
    console.log("page loaded");

    await delay(2000)
    await page.waitForSelector(".HRttj")
    const placesList = await page.evaluate(() => {
        console.log('evaluating restaurant');
        const places = []

        const placesElementSelectors = document.querySelectorAll('.HRttj')
        placesElementSelectors.forEach(placeElement=>{
            const placeImage = placeElement.querySelector("img")?.src || "";
            
            const placeName = placeElement.querySelector("h2")?.innerText || "";
            const placeLink = placeElement.querySelectorAll("a")[2]?.href || "";
            const placeRating = placeElement.querySelector("title")?.innerText || placeElement.querySelector("title")?.innerHTML || "";
            const location = placeElement.querySelector('.suezE')?.innerText || "";
            // const placeRating1 = placeElement.querySelectorAll("svg")[2]?.querySelector("title")?.innerText || "";
            // const placeRating2 = placeElement.querySelectorAll("svg")[3]?.querySelector("title")?.innerText || "";
            // const placeRating3 = placeElement.querySelectorAll("svg")[4]?.querySelector("title")?.innerText || "";
            // const placeRating4 = placeElement.querySelectorAll("svg")[5]?.querySelector("title")?.innerText || "";
            // const placeRating5 = placeElement.querySelectorAll("svg")[6]?.querySelector("title")?.innerText || "";
            // const placeRating6 = placeElement.querySelectorAll("svg")[7]?.querySelector("title")?.innerText || "";
            // const placeRating7 = placeElement.querySelectorAll("svg")[8]?.querySelector("title")?.innerText || "";

            if(placeName?.length > 0){
                places.push({placeImage, placeName, placeLink, placeRating, location})
            }
        })
        return places;
    })
    
    await browser.close()
    return placesList;

    // return restaurantName
}

export {
    scrapeTopAttractions
}