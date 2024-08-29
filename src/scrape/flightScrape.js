import puppeteer from "puppeteer";

const flightScrape = async (source, destination, date) => {
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
  const url = `https://www.kayak.com/flights/${source}-${destination}/${date}?sort=bestflight_a`;
  await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until network is idle
  console.log("URL: " + url);

  console.log("Start Scraping:");

  await page.waitForSelector(".nrc6-wrapper"); // Wait for the flight elements to load

  const flightList = await page.evaluate(() => {
    const flights = [];
    const flightSelectors = document.querySelectorAll(".nrc6-wrapper");

    flightSelectors.forEach((flightElement) => {
      const airlineLogo = flightElement.querySelector("img")?.src || "";
      const [rawDepartureTime, rawArrivalTime] = (
        flightElement.querySelector(".vmXl")?.innerText || ""
      ).split(" – ");

      const extractTime = (rawTime) => {
        const timeWithoutNumbers = rawTime.replace(/[0-9+\s]+$/, "").trim();
        return timeWithoutNumbers;
      };

      const departureTime = extractTime(rawDepartureTime);
      const arrivalTime = extractTime(rawArrivalTime);
      const flightDuration = (
        flightElement.querySelector(".xdW8")?.children[0]?.innerText || ""
      ).trim();

      const airlineName = (
        flightElement.querySelector(".VY2U")?.children[1]?.innerText || ""
      ).trim();

      const price = parseInt(
        (flightElement.querySelector(".f8F1-price-text")?.innerText || "")
          .replace(/[^\d]/g, "")
          .trim(),
        10
      );

      flights.push({
        airlineLogo,
        departureTime,
        arrivalTime,
        flightDuration,
        airlineName,
        price,
      });
    });

    return flights;
  });

  // console.log("Flight List: " + flightList.length, flightList);
  await browser.close();
  return flightList;
};

export default flightScrape;
