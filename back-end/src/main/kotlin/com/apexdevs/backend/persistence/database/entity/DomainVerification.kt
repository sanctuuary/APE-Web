package com.apexdevs.backend.persistence.database.entity

import com.apexdevs.backend.web.controller.entity.domain.DomainVerificationResult
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Document to store verification status of domains.
 * @param domainId the id of the domain that is verified
 * @param ontologySuccess whether the ontology was successfully verified
 * @param useCaseSuccess whether the use case configuration was successfully verified
 */
@Document
class DomainVerification(
    @Id val id: ObjectId,
    val domainId: ObjectId,
    var ontologySuccess: Boolean?,
    var useCaseSuccess: Boolean?,
) {
    constructor(domainId: ObjectId, ontologySuccess: Boolean?, useCaseSuccess: Boolean?) :
        this(ObjectId.get(), domainId, ontologySuccess, useCaseSuccess)

    constructor(domainId: ObjectId, domainVerificationResult: DomainVerificationResult) :
        this(ObjectId.get(), domainId, domainVerificationResult.ontologySuccess, domainVerificationResult.useCaseSuccess)

    fun asResult(): DomainVerificationResult {
        return DomainVerificationResult(this.ontologySuccess, this.useCaseSuccess, null)
    }
}
