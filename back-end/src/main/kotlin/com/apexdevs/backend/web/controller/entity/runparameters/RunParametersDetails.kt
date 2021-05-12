package com.apexdevs.backend.web.controller.entity.runparameters

/**
 * Used to send run parameters information to the front-end.
 */
data class RunParametersDetails(
    val id: String,
    val minSteps: String,
    val maxSteps: String,
    val maxDuration: String,
    val numberOfSolutions: String
)
