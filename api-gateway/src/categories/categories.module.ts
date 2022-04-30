import { Module } from "@nestjs/common"
import { ClientProxyProvider } from "src/common/providers/client-proxy.provider"
import { CategoriesController } from "./categories.controller"

@Module({
    imports: [],
    controllers: [CategoriesController],
    providers: [ClientProxyProvider],
    exports: []
})
export class CategoriesModule {}
