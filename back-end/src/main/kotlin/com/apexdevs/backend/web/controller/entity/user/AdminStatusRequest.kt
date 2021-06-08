package com.apexdevs.backend.web.controller.entity.user

import com.apexdevs.backend.persistence.database.entity.AdminStatus
import org.bson.types.ObjectId

/**
 * Request to change the AdminStatus of a user.
 */
data class AdminStatusRequest(val userId: ObjectId, val adminStatus: AdminStatus)
