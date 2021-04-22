/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Topic document for storing in the database
 *
 * @param id unique identifier
 * @param name topic name
 */
@Document
class Topic(@Id val id: ObjectId, var name: String) {
    constructor(name: String) :
        this(ObjectId.get(), name)
}
