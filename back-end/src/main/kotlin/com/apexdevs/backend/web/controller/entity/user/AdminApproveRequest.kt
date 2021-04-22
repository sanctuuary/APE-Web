/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.user

import com.apexdevs.backend.persistence.database.entity.UserRequest
import org.bson.types.ObjectId

/**
 * Admin approve request for user account request procedure
 */
data class AdminApproveRequest(
    val requestId: ObjectId,
    val email: String,
    val status: UserRequest
)
