import { DefaultCrudRepository } from "@loopback/repository";
import { CardDetailsEntity, CardDetailsEntityRelations } from "../models/entity/card-details.entity";
import { inject } from "@loopback/core";
import { CmsDataSource } from "../datasources";

export class CardDetailsRepository extends DefaultCrudRepository<
CardDetailsEntity,
typeof CardDetailsEntity.prototype,
CardDetailsEntityRelations> {
    constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
        super(CardDetailsEntity, dataSource)
    }
}