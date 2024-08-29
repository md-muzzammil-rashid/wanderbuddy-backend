import puppeteer from "puppeteer";

const trainScrape = async (source, destination, date) => {
  const modifiedData = date.split("-")[2]+date.split("-")[1]+date.split("-")[0];
  console.log("=== Scrape ===");

  const browser = await puppeteer.launch({
    headless: false, // Run in full browser mode
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });
  console.log("Browser is launched!");

  const page = await browser.newPage();
//   const url = `https://www.etrain.info/trains/${source}-to-${destination}/?${date}`;
  const url = `https://www.ixigo.com/search/result/train/${source}/${destination}/${modifiedData}//1/0/0/0/all`

  await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until network is idle
  console.log("URL: " + url);

  console.log("Start Scraping:");

  await page.waitForSelector(".train-data-wrapper"); // Wait for the flight elements to load

  const trainList = await page.evaluate(() => {
    const trains = [];
    const trainSelector = document.querySelectorAll(".train-data-wrapper");

    trainSelector.forEach((trainELement) => {
    //   const trainNumber = trainELement.querySelector(".wd55")?.querySelector('a')?.innerText || "";
    //   const trainName = trainELement.querySelector(".wd282")?.querySelector('a').innerText || "";
    //   const from = trainELement.querySelectorAll(".wd51")[0]?.innerText || "";
    //   const to = trainELement.querySelectorAll(".wd51")[2]?.innerText || "";
    //   const departureTime = trainELement.querySelectorAll(".wd51")[1]?.innerText || "";
    //   const arrivalTime = trainELement.querySelectorAll(".wd51")[3]?.innerText || "";
    //   const duration = trainELement.querySelectorAll(".wd55")[1]?.innerText || "";

    const trainNumber = trainELement.querySelector(".train-number")?.innerText || "";
    const trainName = trainELement.querySelector(".train-name")?.innerText || "";
    const departureTime = trainELement.querySelector(".time")?.innerHTML || ""
    const arrivalTime = trainELement.querySelectorAll(".time")[1]?.innerText || "";
    const trainType = []
    const from = trainELement.querySelectorAll(".station-code")[0].querySelector("a")?.innerText || "";
    const to = trainELement.querySelectorAll(".station-code")[1].querySelector("a")?.innerText || "";
    const duration = trainELement.querySelector(".c-timeline-wrapper")?.querySelectorAll("div")[1]?.innerText || "";
    trainELement.querySelectorAll(".train-class-main")
                .forEach(selector=> {
                    const available = selector.querySelector(".avail-class")?.innerText || "";
                    const price = selector.querySelector(".c-price-display")?.querySelectorAll("span")[1]?.innerText || "";
                    const trainClass = selector.querySelector(".train-class")?.innerText || "";
                    trainType.push({class: trainClass, available, price})
                })
 



      trains.push({
        trainNumber,
        departureTime,
        arrivalTime,
        trainName,
        to,
        from,
        duration,
        trainType
      });
    });

    return trains;
  });

  // console.log("Flight List: " + flightList.length, flightList);
  await browser.close();
  return trainList;
};

export default trainScrape;
