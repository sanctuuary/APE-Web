package com.apexdevs.backend.web.controller.entity.runparameters

/**
 * Used to send run parameters information to the front-end.
 */
data class RunParametersDetails(
    val id: String,
    val minLength: String,
    val maxLength: String,
    val maxDuration: String,
    val solutions: String
)
