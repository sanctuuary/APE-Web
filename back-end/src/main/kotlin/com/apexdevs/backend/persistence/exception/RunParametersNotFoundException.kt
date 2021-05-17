package com.apexdevs.backend.persistence.exception

import org.bson.types.ObjectId

/**
 * When a certain run parameters settings entry is not found.
 */
class RunParametersNotFoundException(val from: Any, val runParametersId: ObjectId, message: String) : RuntimeException(message)
