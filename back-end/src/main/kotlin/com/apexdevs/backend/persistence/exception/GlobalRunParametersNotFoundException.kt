package com.apexdevs.backend.persistence.exception

/**
 * Exception when the global run parameters settings are not found.
 */
class GlobalRunParametersNotFoundException(val from: Any, message: String) : RuntimeException(message)
