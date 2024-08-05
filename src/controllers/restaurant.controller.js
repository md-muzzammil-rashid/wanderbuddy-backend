import { scrapeRestaurant } from "../scrape/restaurantScrape.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";

const getRestaurants = AsyncHandler(async (req, res)=> {
    const {city} = req.query
    console.log(city);
    const result = await scrapeRestaurant(city)
    return res.status(200)
        .json(
            new ApiResponse(200, "Restaurant fetched", result)
        )

})

export {
    getRestaurants
}