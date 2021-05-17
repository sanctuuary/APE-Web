package com.apexdevs.backend.persistence.database.repository

import com.apexdevs.backend.persistence.database.entity.RunParameters
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface RunParametersRepository : MongoRepository<RunParameters, ObjectId>
