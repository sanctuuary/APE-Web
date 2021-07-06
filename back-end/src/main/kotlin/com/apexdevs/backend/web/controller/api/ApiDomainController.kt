/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.collection.DomainCollection
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.TopicNotFoundException
import com.apexdevs.backend.persistence.exception.UserAccessException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.persistence.filesystem.FileTypes
import com.apexdevs.backend.persistence.filesystem.StorageService
import com.apexdevs.backend.web.controller.entity.domain.DomainUploadRequest
import com.apexdevs.backend.web.controller.entity.domain.DomainWithAccessResponse
import com.apexdevs.backend.web.controller.entity.domain.UserAccessUpload
import com.apexdevs.backend.web.controller.entity.domain.UserWithAccessResponse
import com.apexdevs.backend.web.controller.routing.DomainController
import org.bson.types.ObjectId
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import java.util.logging.Logger
import kotlin.IllegalArgumentException

/**
 * Class for handling the Api calls coming from the front-end
 * all Ajax calls for the domain should be made through here
 */
@RestController
@RequestMapping("/api/domain")
class ApiDomainController(
    val storageService: StorageService,
    val domainOperation: DomainOperation,
    val userOperation: UserOperation,
    val topicOperation: TopicOperation,
    val domainCollection: DomainCollection
) {
    /**
     * Allows a user to upload a new domain with all domain files and information
     * @param user authenticated user, automatically retrieved from session
     * @param domainUploadRequest class with all required fields for the domain
     * @param ontology JSON body with the provided names, for the domain names see class
     * @param toolsAnnotations JSON body providing additional information on tools/operations in the domain
     * @return: domain entity converted to JSON
     */
    /*
        TODO
         - add topic definitions
         - make sure user is active and approved
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/upload", consumes = [MediaType.ALL_VALUE])
    fun uploadDomain(
        @AuthenticationPrincipal user: User,
        @ModelAttribute domainUploadRequest: DomainUploadRequest,
        @RequestPart ontology: MultipartFile,
        @RequestPart toolsAnnotations: MultipartFile,
        @RequestPart useCaseRunConfig: MultipartFile?,
        @RequestPart useCaseConstraints: MultipartFile?
    ): String {
        try {
            // find the current user in the database
            val userResult = userOperation.getByEmail(user.username)

            // create a new domain with current user as owner
            val domain = Domain(
                domainUploadRequest.title ?: throw IllegalArgumentException("Could not create domain, the title is missing."),
                domainUploadRequest.description ?: throw IllegalArgumentException("Could not create domain, the description is missing."),
                domainUploadRequest.visibility ?: throw IllegalArgumentException("Could not create domain, the visibility is missing."),
                domainUploadRequest.ontologyPrefix ?: throw IllegalArgumentException("Could not create domain, the ontologyPrefix is missing."),
                domainUploadRequest.toolsTaxonomyRoot ?: throw IllegalArgumentException("Could not create domain, the toolsTaxonomyRoot is missing."),
                domainUploadRequest.dataDimensionsTaxonomyRoots ?: throw IllegalArgumentException("Could not create domain, the dataDimensionsTaxonomyRoots are missing."),
                domainUploadRequest.strictToolsAnnotations ?: throw IllegalArgumentException("Could not create domain, the strictToolsAnnotations is missing.")
            )

            domainUploadRequest.topics?.map { topicId: ObjectId ->
                topicOperation.assignToDomain(topicId, domain)
            }

            var completed = storageService.initDomainDirectories(domain.id)
            // store required files
            completed = completed && storageService.storeDomainFile(domain.id, ontology, FileTypes.Ontology)
            completed = completed && storageService.storeDomainFile(domain.id, toolsAnnotations, FileTypes.ToolsAnnotations)
            useCaseRunConfig?.let { completed = completed && storageService.storeDomainFile(domain.id, it, FileTypes.UseCaseRunConfig) }
            useCaseConstraints?.let { completed = completed && storageService.storeDomainFile(domain.id, it, FileTypes.UseCaseConstraints) }

            if (!completed) {
                storageService.deleteDomainDirectories(domain.id)
                throw InternalError("Uploading files failed")
            }

            domainOperation.createDomain(domain, userResult.id)

            log.info("Domain: ${domain.name} with id: ${domain.id} was uploaded by ${userResult.email}")

            return domain.id.toString()
        } catch (exc: Exception) {
            when (exc) {
                is TopicNotFoundException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, exc.message, exc) // safe message contents
                is IllegalArgumentException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, exc.message, exc)
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorized user not found", exc)
                is InternalError ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Downloads the toolsAnnotations file for the specified domain
     * @param user if the user needs to be authenticated for the domain
     * @param domainId the id of the domain
     * @return an response entity containing the Response entity with the resource
     */
    @GetMapping("/download/tools-annotations/{domainId}")
    fun downloadToolsAnnotations(@AuthenticationPrincipal user: User?, @PathVariable domainId: ObjectId): ResponseEntity<Resource> {
        try {
            val userResult = user?.let { userOperation.getByEmail(it.username) }

            return storageService.loadFileAsResponse(domainId, FileTypes.ToolsAnnotations, userResult)
        } catch (exc: Exception) {
            when (exc) {
                is UserAccessException, is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Downloads the ontology file for the specified domain
     * @param user if the user needs to be authenticated for the domain
     * @param domainId the id of the domain
     * @return an response entity containing the Response entity with the resource
     */
    @GetMapping("/download/ontology/{domainId}")
    fun downloadOntology(@AuthenticationPrincipal user: User?, @PathVariable domainId: ObjectId): ResponseEntity<Resource> {
        try {
            val userResult = user?.let { userOperation.getByEmail(it.username) }

            return storageService.loadFileAsResponse(domainId, FileTypes.Ontology, userResult)
        } catch (exc: Exception) {
            when (exc) {
                is UserAccessException, is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Downloads the ontology file for the specified domain
     * @param user if the user needs to be authenticated for the domain
     * @param domainId the id of the domain
     * @return an response entity containing the Response entity with the resource
     */
    @GetMapping("/download/config/{domainId}")
    fun downloadConfig(@AuthenticationPrincipal user: User?, @PathVariable domainId: ObjectId): ResponseEntity<Resource> {
        try {
            val userResult = user?.let { userOperation.getByEmail(it.username) }

            return storageService.loadFilesAsZippedResponse(domainId, listOf(FileTypes.Ontology, FileTypes.ToolsAnnotations, FileTypes.UseCaseConstraints, FileTypes.UseCaseRunConfig), userResult, "domain_config")
        } catch (exc: Exception) {
            when (exc) {
                is UserAccessException, is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Retrieve domains for authenticated user to which the user has been granted access
     * @param user authenticated user principal, automatically retrieved from session
     * @param userId userId of the user for to check access levels with
     * @param accessRights access rights to include in the result domains
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/with-user-access")
    fun getDomainsWithUserAccess(@AuthenticationPrincipal user: User, @RequestParam userId: ObjectId, @RequestParam accessRights: List<DomainAccess>): List<DomainWithAccessResponse> {
        try {
            // check if authenticated user matches queried user domains
            val authUser = userOperation.getByEmail(user.username)

            if (authUser.id != userId)
                throw AccessDeniedException("Authenticated user not allowed to retrieve domains of this user")

            // perform query on database for user with any domain access listed
            val results: MutableList<DomainWithAccessResponse> = mutableListOf()
            for (userDomainAccess: UserDomainAccess in domainCollection.getDomainsByUserAndAccess(authUser, accessRights)) {
                try {
                    // get domain by domainId
                    val domain = domainOperation.getDomain(userDomainAccess.domainId)

                    // add DomainWithAccessResponse to the list
                    results.add(
                        DomainWithAccessResponse(
                            domain.id.toHexString(),
                            domain.name,
                            domain.description,
                            domain.visibility.toString(),
                            domainOperation.getTopics(domain).map { topic: Topic -> topic.name },
                            authUser.id.toHexString(),
                            userDomainAccess.access.toString()
                        )
                    )
                } catch (exc: DomainNotFoundException) {
                    // do nothing
                }
            }

            return results
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Get all users with access to a domain.
     * @param user authenticated user principal, automatically retrieved from session
     * @param domainId The id of the domain of which the users should have access
     * @param accessRights The access levels the users may have
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/users-with-access/{domainId}")
    fun getUsersWithDomainAccess(
        @AuthenticationPrincipal user: User,
        @PathVariable domainId: ObjectId,
        @RequestParam accessRights: List<DomainAccess>
    ): List<UserWithAccessResponse> {
        try {
            // check if the user is the owner of the domain
            val authUser = userOperation.getByEmail(user.username)
            val domain = domainOperation.getDomain(domainId)
            val requestUserIsOwner = domainOperation.hasUserAccess(domain, DomainAccess.Owner, authUser.id)
            if (!requestUserIsOwner)
                throw AccessDeniedException("User is not the owner of the domain")

            // get a list of all users who have access to the domain
            val domainAccessList = domainOperation.getUsersByDomainAndAccess(domainId, accessRights)
            // create a list of front-end safe objects to send back
            val accessInfo: MutableList<UserWithAccessResponse> = mutableListOf()
            for (domainAccess in domainAccessList) {
                val userWithAccess = userOperation.userRepository.findById(domainAccess.userId)
                if (userWithAccess.isEmpty) {
                    log.warning(
                        "Failed to find user with id ${domainAccess.userId}," +
                            "but a user with this id does have access to the domain with id: ${domainAccess.domainId}" +
                            " according to UserDomainAccess object with id: ${domainAccess.id}!"
                    )
                    continue
                }

                val info = UserWithAccessResponse(
                    domainAccess.id.toString(),
                    domainAccess.userId.toString(),
                    userWithAccess.get().displayName,
                    domainAccess.domainId.toString(),
                    domainAccess.access
                )
                accessInfo.add(info)
            }
            return accessInfo
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
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
            DomainController.log.info(
                "Ownership of domain \"${domain.name}\" with id: ${domain.id} " +
                    "transferred to user \"${newOwner.get().displayName}\" with id $userId"
            )
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, exc.message, exc)
                is DomainNotFoundException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, exc.message, exc)
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    companion object {
        val log: Logger = Logger.getLogger("ApiDomainController_Logger")
    }
}
