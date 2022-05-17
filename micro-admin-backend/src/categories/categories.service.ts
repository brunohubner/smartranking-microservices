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

    async create(category: Category): Promise<void> {
        try {
            await new this.categoryModel(category).save()
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findAll(): Promise<Category[]> {
        try {
            return this.categoryModel.find()
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findById(_id: string): Promise<Category> {
        try {
            const category = await this.categoryModel.findById(_id)
            if (!category) {
                throw new RpcException(
                    `The category with ID ${_id} does not exists.`
                )
            }
            return category
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findByName(name: string): Promise<Category> {
        try {
            const category = await this.categoryModel.findOne({ name })
            if (!category) {
                throw new RpcException(
                    `The category with name ${name} does not exists.`
                )
            }
            return category
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async update(_id: string, category: Category): Promise<void> {
        try {
            await this.categoryModel.findByIdAndUpdate(_id, category)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
