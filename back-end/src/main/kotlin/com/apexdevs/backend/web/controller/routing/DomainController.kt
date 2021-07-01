/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.collection.DomainCollection
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.persistence.filesystem.FileTypes
import com.apexdevs.backend.persistence.filesystem.StorageService
import com.apexdevs.backend.web.controller.entity.domain.DomainDetails
import com.apexdevs.backend.web.controller.entity.domain.DomainRequest
import com.apexdevs.backend.web.controller.entity.domain.DomainUploadRequest
import com.apexdevs.backend.web.controller.entity.domain.UserAccessUpload
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import java.util.logging.Logger

/**
 * Class for handling the regular calls coming from the front-end
 * All regular data calls for the domain should be made through here
 */
@RestController
@RequestMapping("/domain")
class DomainController(val storageService: StorageService, val domainOperation: DomainOperation, val userOperation: UserOperation, val domainCollection: DomainCollection, val topicOperation: TopicOperation) {
    /**
     * Returns all public domains
     * @param user optional user credentials
     * @return list of all public domains
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun getPublicDomains(): List<DomainRequest> {
        try {
            // get all public domains
            val domains = domainCollection.getPublicDomains()
            val safeDomains: MutableList<DomainRequest> = mutableListOf()

            domains.map {
                domain: Domain ->
                // get all topics of domain and convert it all to a type safe to send
                val topicStrings: MutableList<String> = mutableListOf()
                domainOperation.getTopics(domain).map { topic: Topic -> topicStrings.add(topic.name) }
                safeDomains.add(DomainRequest(domain.id.toHexString(), domain.name, topicStrings, domain.description))
            }

            return safeDomains
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * Returns domain information of requested domain
     * For public domains no login is necessary
     * For non-public domains (private, archived) users must be logged in and have read privileges
     * @param user optional user credentials
     * @param id the domain id in path variable
     * @return domain information
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    fun getDomain(@AuthenticationPrincipal user: User?, @PathVariable id: ObjectId): DomainDetails {
        try {
            val domain = domainOperation.getDomain(id)

            if (user != null) {
                // check user access to domain
                val userResult = userOperation.getByEmail(user.username)

                // throw exception if not allowed
                if (!domainOperation.hasUserAccess(domain, DomainAccess.Read, userResult.id))
                    throw AccessDeniedException("User does not have access to domain")
            } else {
                // check if anonymous user has access to this domain
                if (!domainOperation.hasAnonymousAccess(domain, DomainAccess.Read))
                    throw UserNotFoundException(this, "Anonymous user not allowed to view this domain")
            }

            return domainOperation.getDomainDetails(domain)
        } catch (exc: Exception) {
            when (exc) {
                is DomainNotFoundException ->
                    throw ResponseStatusException(HttpStatus.NOT_FOUND, "Domain not found", exc)
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "User does not have access to domain", exc)
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Anonymous user not allowed to view this domain", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Updates requested domain with given (partial) data
     * This data should be sent in a form where only the fields that need to be updated are included
     * @param user user credentials
     * @param id the domain id in path variable
     * @param changes a (partial) DomainUploadRequest, only send the fields you want to update
     * @param ontology optional ontology file
     * @param toolsAnnotations optional tools annotations file
     */
    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    fun updateDomain(
        @AuthenticationPrincipal user: User,
        @PathVariable id: ObjectId,
        @ModelAttribute changes: DomainUploadRequest,
        @RequestPart ontology: MultipartFile?,
        @RequestPart toolsAnnotations: MultipartFile?,
        @RequestPart useCaseRunConfig: MultipartFile?,
        @RequestPart useCaseConstraints: MultipartFile?
    ) {
        try {
            val domain = domainOperation.getDomain(id)
            val u = userOperation.getByEmail(user.username)

            // update fields in domain repository
            domainOperation.updateDomain(domain, u.id, changes)

            // update fields in topic repository
            topicOperation.updateDomainTopics(domain, changes.topics)

            // update domain files in storage
            ontology?.let { file -> storageService.storeDomainFile(domain.id, file, FileTypes.Ontology) }
            toolsAnnotations?.let { file -> storageService.storeDomainFile(domain.id, file, FileTypes.ToolsAnnotations) }
            useCaseRunConfig?.let { file -> storageService.storeDomainFile(domain.id, file, FileTypes.UseCaseRunConfig) }
            useCaseConstraints?.let { file -> storageService.storeDomainFile(domain.id, file, FileTypes.UseCaseConstraints) }

            log.info("Domain: ${domain.name} with id: ${domain.id} was updated by ${u.email}")
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * Set the access a user has to a domain.
     * @param user authenticated user principal, automatically retrieved from session
     * @param id The domain to which the access is set
     * @param userAccess The information to set the access (the user id and access level)
     */
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/{id}/access")
    fun setUserAccess(
        @AuthenticationPrincipal user: User,
        @PathVariable id: ObjectId,
        @RequestBody userAccess: UserAccessUpload
    ) {
        try {
            // check if the user is the owner of the domain
            val authUser = userOperation.getByEmail(user.username)
            val domain = domainOperation.getDomain(id)
            val requestUserIsOwner = domainOperation.hasUserAccess(domain, DomainAccess.Owner, authUser.id)
            if (!requestUserIsOwner)
                throw AccessDeniedException("User is not the owner of the domain")

            domainOperation.setUserAccess(id, userAccess.userId, userAccess.access)
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, exc.message, exc)
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Transfer ownership of a domain to a new user.
     * The old owner will get ReadWrite access.
     * @param user authenticated user principal, automatically retrieved from session.
     * @param id the id of the domain to transfer ownership of.
     * @param userId the user who will receive the ownership of the domain.
     */
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("{id}/transfer/{userId}")
    fun transferOwnership(
        @AuthenticationPrincipal user: User,
        @PathVariable id: ObjectId,
        @PathVariable userId: ObjectId
    ) {
        try {
            // check if the user is the owner of the domain
            val authUser = userOperation.getByEmail(user.username)
            val domain = domainOperation.getDomain(id)
            val requestUserIsOwner = domainOperation.hasUserAccess(domain, DomainAccess.Owner, authUser.id)
            if (!requestUserIsOwner)
                throw AccessDeniedException("User is not the owner of the domain")

            // check if the new owner exists
            val newOwner = userOperation.userRepository.findById(userId)
            if (newOwner.isEmpty)
                throw UserNotFoundException(this, "New owner with id: $userId not found")

            // transfer ownership
            domainOperation.setUserAccess(id, userId, DomainAccess.Owner)
            domainOperation.setUserAccess(id, authUser.id, DomainAccess.ReadWrite)
            log.info(
                "Ownership of domain \"${domain.name}\" with id: ${domain.id} " +
                    "transferred to user \"${newOwner.get().displayName}\" with id $userId"
            )
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, exc.message, exc)
                is DomainNotFoundException ->
                    throw ResponseStatusException(HttpStatus.NOT_FOUND, exc.message, exc)
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.NOT_FOUND, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    companion object {
        val log: Logger = Logger.getLogger("DomainController_Logger")
    }
}
