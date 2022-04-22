package com.apexdevs.backend.persistence.exception

import org.bson.types.ObjectId

class DomainVerificationNotFoundException(val from: Any, val domainId: ObjectId, message: String) : RuntimeException(message)
