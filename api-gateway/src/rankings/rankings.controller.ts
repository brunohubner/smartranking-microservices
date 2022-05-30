import { Controller, Get, Query } from "@nestjs/common"
import { RankingsService } from "./rankings.service"

@Controller("api/v1/rankings")
export class RankingsController {
    constructor(private readonly rankingsService: RankingsService) {}

    @Get()
    findByCategoryId(
        @Query("category_id") category_id: string,
        @Query("date") date: string
    ): Promise<any> {
        return this.rankingsService.findByCategoryId(category_id, date)
    }
}
