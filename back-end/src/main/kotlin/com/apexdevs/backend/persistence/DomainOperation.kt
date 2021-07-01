/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainTopic
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.database.repository.DomainRepository
import com.apexdevs.backend.persistence.database.repository.DomainTopicRepository
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import com.apexdevs.backend.persistence.database.repository.UserDomainAccessRepository
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.UserAccessException
import com.apexdevs.backend.persistence.exception.UserDomainAccessNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.domain.DomainDetails
import com.apexdevs.backend.web.controller.entity.domain.DomainUploadRequest
import org.bson.types.ObjectId
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Component

/**
 * Performs domain operations on the database
 * @param domainRepository (autowired)
 * @param userRepository (autowired)
 * @param userDomainAccessRepository (autowired)
 * @param domainTopicRepository (autowired)
 * @param topicRepository (autowired)
 */
@Component
class DomainOperation(val domainRepository: DomainRepository, val userRepository: UserRepository, val userDomainAccessRepository: UserDomainAccessRepository, val domainTopicRepository: DomainTopicRepository, val topicRepository: TopicRepository) {
    /**
     * Create a new domain, with provided user id as the owner
     * @param domain constructed domain to add to database
     * @param ownerId of user that created the domain
     */
    @Throws(UserNotFoundException::class)
    fun createDomain(domain: Domain, ownerId: ObjectId) {
        // Lookup referenced user
        val user = userRepository.findById(ownerId)

        if (user.isPresent) {
            // If user exists, create domain
            domainRepository.insert(domain)
            // Add this user as domain owner
            userDomainAccessRepository.insert(UserDomainAccess(user.get().id, domain.id, DomainAccess.Owner))
        } else {
            throw UserNotFoundException(this, "Invalid user with id: $ownerId, cannot create domain")
        }
    }

    /**
     * Retrieves the domain and throws an exception if not found. Useful flow for handling web requests
     * @param domainId of domain to retrieve
     * @throws DomainNotFoundException if domain is not in database
     * @return Domain that matches the domainId
     */
    @Throws(DomainNotFoundException::class)
    fun getDomain(domainId: ObjectId): Domain {
        val domainResult = domainRepository.findById(domainId)

        if (domainResult.isEmpty)
            throw DomainNotFoundException(this, domainId, "Requested domain was not found")

        return domainResult.get()
    }

    /**
     * Gets the topics of a domain
     * @param domain to retrieve topics for
     * @return list of topics that are assigned to the domain
     */
    fun getTopics(domain: Domain): List<Topic> {
        return topicRepository.findAllById(domainTopicRepository.findByDomainId(domain.id).map { domainTopic: DomainTopic -> domainTopic.topicId }).toList()
    }

    /**
     * Gets the domain access level of the given user
     * @param user to check access for
     * @param domain to check the user's access for
     * @throws userDomainAccessRepository if no access entry is stored for the user
     */
    @Throws(UserDomainAccessNotFoundException::class)
    fun getDomainAccess(user: User, domain: Domain): DomainAccess {
        val userDomainAccess = userDomainAccessRepository.findByUserIdAndDomainId(user.id, domain.id)
        if (userDomainAccess.isEmpty)
            throw UserDomainAccessNotFoundException("UserDomainAccess not found!")
        return userDomainAccess.get().access
    }

    /**
     * Save an altered domain, checks if user has edit rights
     * @param domain to save to the database
     * @param userId of the user that altered the domain
     * @throws UserAccessException if user is not allowed to edit the domain
     */
    @Throws(UserAccessException::class)
    fun saveDomain(domain: Domain, userId: ObjectId) {
        if (isAuthorizedDomainUser(domain, userId, DomainAccess.ReadWrite))
            domainRepository.save(domain)
        else
            throw UserAccessException(this, userId, "User not authorized to edit domain")
    }

    /**
     * Archive a domain, checks if user is owner
     * @param domain to archive
     * @param userId of user that performs the archive
     * @throws UserNotFoundException if user is not found in database
     * @throws UserAccessException if no user access entry is found in the database
     */
    @Throws(UserNotFoundException::class, UserAccessException::class)
    fun archiveDomain(domain: Domain, userId: ObjectId) {
        if (isAuthorizedDomainUser(domain, userId, DomainAccess.Owner)) {
            domain.visibility = DomainVisibility.Archived
            domainRepository.save(domain)
        } else {
            throw UserAccessException(this, userId, "User not authorized to archive domain")
        }
    }

    /**
     * Returns true if user has specified access to the domain
     * @param domain the domain to check access to
     * @param access the access required
     * @param userId the user that requires access
     * @return true if -> user requested read access and domain is public OR user has the requested access or more privilege on the domain
     */
    fun hasUserAccess(domain: Domain, access: DomainAccess, userId: ObjectId): Boolean {
        return if (access == DomainAccess.Read) {
            domain.visibility == DomainVisibility.Public || isAuthorizedDomainUser(domain, userId, access)
        } else {
            isAuthorizedDomainUser(domain, userId, access)
        }
    }

    /**
     * Returns true if anonymous user has specified access to the domain
     * @param domain the domain to check access to
     * @param access the access required
     * @return true if requested access is 'read' and domain is public
     */
    fun hasAnonymousAccess(domain: Domain, access: DomainAccess): Boolean {
        return access == DomainAccess.Read && domain.visibility == DomainVisibility.Public
    }

    /**
     * Set what the user can do with the domain with DomainAccess rights
     * @param domain to change access for
     * @param userId of user that attains new access status
     * @param access status to set for user
     * @throws UserNotFoundException if user is not found in database
     */
    @Throws(UserNotFoundException::class)
    fun setUserAccess(domain: Domain, userId: ObjectId, access: DomainAccess) {
        // Find user with userId
        val user = userRepository.findById(userId)

        if (user.isPresent) {
            // Check if user-domain entry already exists
            val doc = userDomainAccessRepository.findByUserIdAndDomainId(user.get().id, domain.id)

            if (doc.isPresent) {
                // Edit access rights and save
                val docEdit = doc.get()
                docEdit.access = access
                userDomainAccessRepository.save(docEdit)
            } else {
                // Insert new user-domain entry with access rights
                userDomainAccessRepository.insert(UserDomainAccess(user.get().id, domain.id, access))
            }
        } else {
            // No user found with userId, throw user not found exception
            throw UserNotFoundException(this, "Invalid user with id: $userId, domain access not updated")
        }
    }

    /**
     * Set what the user can do with the domain (with domainId) with DomainAccess rights
     * @param domainId of domain to change user access for
     * @param userId of user that attains new access status
     * @param access status to set for user
     * @throws DomainNotFoundException if domain is not found in database
     * @throws UserNotFoundException if user is not found in database
     */
    @Throws(DomainNotFoundException::class, UserNotFoundException::class)
    fun setUserAccess(domainId: ObjectId, userId: ObjectId, access: DomainAccess) {
        // Find domain with domainId
        val result = domainRepository.findById(domainId)

        // If found, call function overload
        if (result.isPresent)
            setUserAccess(result.get(), userId, access)
        else // If not found, throw domain not found exception
            throw DomainNotFoundException(this, domainId, "Invalid domain, domain access not updated")
    }

    /**
     * Updates an existing domain with the provided changes
     * @param domain the domain to update
     * @param userId the user that has at least readWrite access to the domain
     * @param changes the changes to the existing domain
     */
    fun updateDomain(domain: Domain, userId: ObjectId, changes: DomainUploadRequest) {
        changes.title?.let { domain.name = it }
        changes.description?.let { domain.description = it }
        changes.visibility?.let { domain.visibility = it }
        changes.ontologyPrefix?.let { domain.ontologyPrefixIRI = it }
        changes.toolsTaxonomyRoot?.let { domain.toolsTaxonomyRoot = it }
        changes.dataDimensionsTaxonomyRoots?.let { domain.dataDimensionsTaxonomyRoots = it }
        changes.strictToolsAnnotations?.let { domain.strictToolsAnnotations = it }

        saveDomain(domain, userId)
    }

    /**
     * Returns domain information
     * @param domain to retrieve detailed information from
     */
    fun getDomainDetails(domain: Domain): DomainDetails {
        val topics = getTopics(domain).map { it.name }
        return DomainDetails(domain.id.toHexString(), domain.name, domain.description, domain.visibility, topics, domain.ontologyPrefixIRI, domain.toolsTaxonomyRoot, domain.dataDimensionsTaxonomyRoots)
    }

    /**
     * Returns true if user has the required access or better on the domain
     * @param domain to check authorization for
     * @param userId for user to check authorization for
     * @return true is user has at least the required access on the domain or has more privilege
     */
    private fun isAuthorizedDomainUser(domain: Domain, userId: ObjectId, requiredAccess: DomainAccess): Boolean {
        val user = userRepository.findById(userId)

        // If user not found, return false
        if (user.isEmpty)
            return false

        val userAccess = userDomainAccessRepository.findByUserIdAndDomainId(user.get().id, domain.id)

        // Return true if user has access rights and these are better or equal to required access rights
        return userAccess.isPresent && userAccess.get().access >= requiredAccess
    }

    /**
     * Gets all users who have one of the given access levels to a certain domain.
     * @param domainId The id of the domain to which the users should have access.
     * @param access The access levels which the users should have.
     * @return A list of user id's with the access level the users have to the domain.
     */
    fun getUsersByDomainAndAccess(domainId: ObjectId, access: List<DomainAccess>): List<UserDomainAccess> {
        val usersByDomainAndAccess: MutableList<UserDomainAccess> = mutableListOf()
        for (accessRight in access) {
            usersByDomainAndAccess += userDomainAccessRepository.findAllByDomainIdAndAccess(domainId, accessRight)
        }
        return usersByDomainAndAccess.toList()
    }
}
