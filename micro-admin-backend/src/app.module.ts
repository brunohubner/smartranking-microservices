import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { env } from "./config/env"
import { CategorySchema } from "./interfaces/categories/category.schema"
import { PlayerSchema } from "./interfaces/players/player.shema"

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({ uri: env.DATABASE_URL })
        }),
        MongooseModule.forFeature([
            { name: "Category", schema: CategorySchema },
            { name: "Player", schema: PlayerSchema }
        ])
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
