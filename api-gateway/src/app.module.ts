import { Module } from "@nestjs/common"
import { CategoriesModule } from "./categories/categories.module"
import { PlayersModule } from './players/players.module';

@Module({
    imports: [CategoriesModule, PlayersModule],
    controllers: [],
    providers: []
})
export class AppModule {}
