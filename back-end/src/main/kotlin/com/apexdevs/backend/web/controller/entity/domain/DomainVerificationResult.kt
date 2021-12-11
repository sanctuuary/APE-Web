package com.apexdevs.backend.web.controller.entity.domain

/**
 * Used to send domain verification information to the front-end.
 * @param ontologySuccess Whether the ontology was successfully verified.
 * @param useCaseSuccess Whether the use case configuration was successfully verified.
 */
data class DomainVerificationResult(
    val ontologySuccess: Boolean?,
    val useCaseSuccess: Boolean?,
)