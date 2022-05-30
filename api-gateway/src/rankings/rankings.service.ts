import { BadRequestException, Get, Injectable, Query } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"

@Injectable()
export class RankingsService {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    @Get()
    findByCategoryId(
        @Query("category_id") category_id: string,
        @Query("date") date: string
    ): Promise<any> {
        if (!category_id) {
            throw new BadRequestException("Category ID is missing.")
        }

        return firstValueFrom(
            this.clientProxyProvider.rankings.send("find-by-category-id", {
                category_id,
                date: date || ""
            })
        )
    }
}
