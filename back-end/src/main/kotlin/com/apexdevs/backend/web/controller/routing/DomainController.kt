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
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
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
                val owner = domainOperation.getOwner(domain.id)
                val isAdmin = userOperation.userIsAdmin(owner.email)
                safeDomains.add(
                    DomainRequest(
                        domain.id.toHexString(),
                        domain.name, topicStrings,
                        domain.description,
                        isAdmin,
                        owner.displayName
                    )
                )
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

    companion object {
        val log: Logger = Logger.getLogger("DomainController_Logger")
    }
}
