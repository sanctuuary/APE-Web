package com.apexdevs.backend.web.controller.entity.runparameters

/**
 * Class with all required fields for run parameters
 * @param minSteps the highest allowed minimum step value
 * @param maxSteps the highest allowed maximum step value
 * @param maxDuration the highest allowed maximum run duration value
 * @param numberOfSolutions the highest allowed number of solutions value
 */
data class RunParametersUploadRequest(val minSteps: Int, val maxSteps: Int, val maxDuration: Int, val numberOfSolutions: Int)
