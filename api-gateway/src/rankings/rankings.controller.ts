import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { Observable } from "rxjs"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"

@Controller("api/v1/rankings")
export class RankingsController {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    @Get()
    findByCategoryId(
        @Query("category_id") category_id: string,
        @Query("date") date: string
    ): Observable<any> {
        if (!category_id) {
            throw new BadRequestException("Category ID is missing.")
        }

        return this.clientProxyProvider.rankings.send("find-by-category-id", {
            category_id,
            date: date || ""
        })
    }
}
