import flightScrape from "../scrape/flightScrape.js";
import trainScrape from "../scrape/trainScrape.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";

const getFlight = AsyncHandler(async (req, res)=> {
    const {destination, source, date} = req.query
    const flights = await flightScrape(source, destination, date);
    return res.status(200)
        .json(
            new ApiResponse(200, "fetched flight", {destination,source,date, flights})
        )
})

const getTrain = AsyncHandler(async (req, res)=> {
    const {destination, source, date} = req.query
    const trains = await trainScrape(source, destination, date);
    return res.status(200)
        .json(
            new ApiResponse(200, "fetched flight", {destination,source,date, trains})
        )
})

export {
    getFlight,
    getTrain
}