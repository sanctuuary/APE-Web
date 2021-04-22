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
 * Determines current user account status
 */
enum class UserStatus { Pending, Approved, Revoked }

/**
 * User document, for database storage
 */
@Document
class User(@Id val id: ObjectId, @Indexed(unique = true) val email: String, var password: String, val displayName: String, var status: UserStatus) {
    constructor(email: String, password: String, displayName: String, status: UserStatus) :
        this(ObjectId.get(), email, password, displayName, status)
}
