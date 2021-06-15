/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.repository

import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserDomainAccessRepository : MongoRepository<UserDomainAccess, ObjectId> {
    fun findByUserIdAndDomainId(userId: ObjectId, domainId: ObjectId): Optional<UserDomainAccess>
    fun findByDomainId(domainId: ObjectId): List<UserDomainAccess>
    fun findAllByUserIdAndAccess(userId: ObjectId, access: DomainAccess): List<UserDomainAccess>
    fun findAllByDomainIdAndAccess(domainId: ObjectId, access: DomainAccess): List<UserDomainAccess>
}
