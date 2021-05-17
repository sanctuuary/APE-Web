package com.apexdevs.backend.persistence.exception

/**
 * When the run parameters of a workflow run request exceed the configured limits.
 */
class RunParametersExceedLimitsException(val from: Any, message: String) : RuntimeException(message)
