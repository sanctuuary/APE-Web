/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.repository

import com.apexdevs.backend.persistence.database.entity.UserApproveRequest
import com.apexdevs.backend.persistence.database.entity.UserRequest
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

/**
 * Repository for user approval requests
 */
@Repository
interface UserApproveRequestRepository : MongoRepository<UserApproveRequest, ObjectId> {
    fun findByUserId(userId: ObjectId): List<UserApproveRequest>
    fun findByStatus(status: UserRequest): List<UserApproveRequest>
}
