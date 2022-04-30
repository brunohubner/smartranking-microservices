import { Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { RpcException } from "@nestjs/microservices"
import { Category } from "./interfaces/category.interface"

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name)

    constructor(
        @InjectModel("Category")
        private readonly categoryModel: Model<Category>
    ) {}

    async create(category: Category): Promise<Category> {
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

    async findAll(): Promise<Category[]> {
        try {
            return this.categoryModel.find().populate("players")
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findById(_id: string): Promise<Category> {
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

    async update(_id: string, category: Category): Promise<Category> {
        const categoryExists = await this.findById(_id)

        if (category?.description) {
            categoryExists.description = category.description
        }
        category?.events?.length &&
            categoryExists.events.push(...category.events)

        await categoryExists.save()
        return categoryExists
    }
}
