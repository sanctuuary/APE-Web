/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.collection

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.database.repository.DomainRepository
import com.apexdevs.backend.persistence.database.repository.UserDomainAccessRepository
import org.springframework.stereotype.Component

/**
 * Class for handling domain collections. Public functions include getting all public domains, all private domains, all
 * owned domains, all read domains, all readwrite domains and all revoked domains.
 * @param domainRepository
 * @param userDomainAccessRepository
 */
@Component
class DomainCollection(val domainRepository: DomainRepository, val userDomainAccessRepository: UserDomainAccessRepository) {

    /**
     * Gets all public domains stored in the database
     * @return List<Domain>: A list of all domains stored in the database
     */
    fun getPublicDomains(): List<Domain> {
        return domainRepository.findAllByVisibility(DomainVisibility.Public)
    }

    /**
     * Gets all domains for which the user has one of the specific set of access levels
     * @param user: The user to get domains for
     * @param access: The access levels for which domains need to be retrieved (which the user has)
     * @return List<UserDomainAccess>: A list of all domains for which the user has an access level included in the given set of access levels
     */
    fun getDomainsByUserAndAccess(user: User, access: List<DomainAccess>): List<UserDomainAccess> {
        val domainsByUserAndAccess: MutableList<UserDomainAccess> = mutableListOf()
        for (accessLevel in access) {
            domainsByUserAndAccess += userDomainAccessRepository.findAllByUserIdAndAccess(user.id, accessLevel)
        }

        return domainsByUserAndAccess.toList()
    }
}
