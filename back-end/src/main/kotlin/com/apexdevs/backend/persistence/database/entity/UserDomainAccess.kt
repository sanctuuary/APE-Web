/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

// Ordinal domain access, maintain this order!
enum class DomainAccess { Revoked, Read, ReadWrite, Owner }

/**
 * Document to link user to domain with granted access
 */
@Document
class UserDomainAccess(@Id val id: ObjectId, val userId: ObjectId, val domainId: ObjectId, var access: DomainAccess) {
    constructor(userId: ObjectId, domainId: ObjectId, access: DomainAccess) :
        this(ObjectId.get(), userId, domainId, access)
}
