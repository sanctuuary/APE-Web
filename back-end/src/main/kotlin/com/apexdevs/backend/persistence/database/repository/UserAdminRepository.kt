/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.repository

import com.apexdevs.backend.persistence.database.entity.AdminStatus
import com.apexdevs.backend.persistence.database.entity.UserAdmin
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.Optional

/**
 * Repository for admin users
 */
@Repository
interface UserAdminRepository : MongoRepository<UserAdmin, ObjectId> {
    fun findByUserIdAndAdminStatus(userId: ObjectId, adminStatus: AdminStatus): Optional<UserAdmin>
}
