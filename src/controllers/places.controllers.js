import { scrapeTopAttractions } from "../scrape/topAttractionScrape.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";

const getTopAttraction = AsyncHandler(async (req, res)=> {
    const topPlaces = await scrapeTopAttractions();
    return res.status(200)
        .json(
            new ApiResponse(200, "Top attractions fetched successfully", topPlaces)
        )
})

export {
    getTopAttraction
}