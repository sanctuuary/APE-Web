package com.apexdevs.backend.persistence.database.repository

import com.apexdevs.backend.persistence.database.entity.DomainVerification
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface DomainVerificationRepository : MongoRepository<DomainVerification, ObjectId> {
    fun findByDomainId(domainId: ObjectId): Optional<DomainVerification>
}
