/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

enum class UserRequest { Pending, Approved, Denied }

/**
 * User approval request document, for database storage
 */
@Document
class UserApproveRequest(@Id val id: ObjectId, val userId: ObjectId, val motivation: String, var status: UserRequest) {
    constructor(userId: ObjectId, motivation: String, status: UserRequest) :
        this(ObjectId.get(), userId, motivation, status)
}
