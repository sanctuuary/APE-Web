package com.apexdevs.backend.persistence.exception

import org.bson.types.ObjectId

class RunParametersNotFoundException(val from: Any, val runParametersId: ObjectId, message: String) : RuntimeException(message)
