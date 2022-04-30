import { Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Category } from "./interfaces/categories/category.interface"
import { Player } from "./interfaces/players/player.interface"
import { Model } from "mongoose"
import { RpcException } from "@nestjs/microservices"

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name)

    constructor(
        @InjectModel("Category")
        private readonly categoryModel: Model<Category>,
        @InjectModel("Player")
        private readonly playersModel: Model<Player>
    ) {}

    async createCategory(category: Category): Promise<Category> {
        try {
            const categoryExists = await this.categoryModel.findOne({
                name: category.name
            })
            if (categoryExists) {
                throw new RpcException(
                    `Category ${category.name} already registered.`
                )
            }

            const categoryCreated = new this.categoryModel(category)
            await categoryCreated.save()
            this.logger.log(JSON.stringify(categoryCreated))
            return categoryCreated
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findAllCategories(): Promise<Category[]> {
        try {
            return this.categoryModel.find().populate("players")
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findCategoryById(_id: string): Promise<Category> {
        try {
            const category = await this.categoryModel
                .findById(_id)
                .populate("players")
            if (!category) {
                throw new RpcException(
                    `The category with ID ${_id} do not exists.`
                )
            }
            return category
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
