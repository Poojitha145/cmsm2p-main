import { DefaultCrudRepository } from "@loopback/repository";
import { CardCustomerEntity, CardCustomerEntityRelations, CardCustomerEntityWithRelations } from "../models/entity/card-customer.entity";
import { inject } from "@loopback/core";
import { CmsDataSource } from "../datasources";

export class CardCustomerRepository extends DefaultCrudRepository<
CardCustomerEntity,
typeof CardCustomerEntity.prototype.id,
CardCustomerEntityRelations> {
    constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
        super(CardCustomerEntity, dataSource);
    }
}