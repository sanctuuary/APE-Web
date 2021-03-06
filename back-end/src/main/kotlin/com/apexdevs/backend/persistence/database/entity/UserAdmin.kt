/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Determines current admin status for user admin entry
 */
enum class AdminStatus { Revoked, Active }

/**
 * Admin user document, for database storage
 */
@Document
class UserAdmin(@Id val id: ObjectId, @Indexed(unique = true) val userId: ObjectId, val adminStatus: AdminStatus) {
    constructor(userId: ObjectId, adminStatus: AdminStatus) :
        this(ObjectId.get(), userId, adminStatus)
}
