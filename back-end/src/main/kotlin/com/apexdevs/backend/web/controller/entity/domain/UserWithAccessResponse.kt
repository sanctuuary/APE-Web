package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.persistence.database.entity.DomainAccess

/**
 * Class to send users with their access level to a domain to the front-end.
 * @param id unique identifier of the UserDomainAccess object.
 * @param userId The id of the user who has access.
 * @param userDisplayName The display name of the user.
 * @param domainId The id of the domain to which the user has access.
 * @param accessRight The DomainAccess level the user has to the domain.
 */
data class UserWithAccessResponse(
    val id: String,
    val userId: String,
    val userDisplayName: String,
    val domainId: String,
    val accessRight: DomainAccess
)
