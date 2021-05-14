package com.apexdevs.backend.web.controller.entity.runparameters

/**
 * Class with all required fields for run parameters
 * @param minLength the highest allowed minimum step value
 * @param maxLength the highest allowed maximum step value
 * @param maxDuration the highest allowed maximum run duration value
 * @param solutions the highest allowed number of solutions value
 */
data class RunParametersUploadRequest(val minLength: Int, val maxLength: Int, val maxDuration: Int, val solutions: Int)
