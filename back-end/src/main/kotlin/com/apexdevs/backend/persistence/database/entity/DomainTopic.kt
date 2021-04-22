/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Document to link Topics to Domains
 *
 * @param domainId domain id
 * @param topicId connected topic id
 */
@Document
class DomainTopic(@Id val id: ObjectId, val domainId: ObjectId, val topicId: ObjectId) {
    constructor(domainId: ObjectId, topicId: ObjectId) :
        this(ObjectId.get(), domainId, topicId)
}
