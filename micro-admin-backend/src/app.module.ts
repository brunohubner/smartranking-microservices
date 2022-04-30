import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CategoriesModule } from "./categories/categories.module"
import { env } from "./common/config/env"
import { PlayersModule } from "./players/players.module"

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({ uri: env.DATABASE_URL })
        }),
        // PlayersModule,
        CategoriesModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
