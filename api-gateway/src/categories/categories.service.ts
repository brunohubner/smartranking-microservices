import { BadRequestException, Injectable } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"
import { Category } from "./interfaces/category.interface"

@Injectable()
export class CategoriesService {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<void> {
        let category: Category

        try {
            category = await firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-category-by-name",
                    createCategoryDto.name
                )
            )
        } catch {
            //
        }

        if (category) {
            throw new BadRequestException(
                `The category with name ${createCategoryDto.name} already exists.`
            )
        }

        return firstValueFrom(
            this.clientProxyProvider.adminBackend.emit(
                "create-category",
                createCategoryDto
            )
        )
    }

    async findAll(): Promise<any[]> {
        return firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-all-categories",
                ""
            )
        )
    }

    async findById(_id: string): Promise<any> {
        return firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-category-by-id",
                _id
            )
        )
    }

    async update(
        _id: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<void> {
        const category = await firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-category-by-id",
                _id
            )
        )
        if (category) {
            throw new BadRequestException(
                `The category with ID ${_id} does not exists.`
            )
        }

        return firstValueFrom(
            this.clientProxyProvider.adminBackend.emit("update-category", {
                _id,
                category: updateCategoryDto
            })
        )
    }
}
