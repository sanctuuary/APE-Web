/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.RunParameters
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.UserRequest
import com.apexdevs.backend.persistence.exception.RunParametersNotFoundException
import com.apexdevs.backend.persistence.exception.UserApproveRequestNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.runparameters.RunParametersDetails
import com.apexdevs.backend.web.controller.entity.runparameters.RunParametersUploadRequest
import com.apexdevs.backend.web.controller.entity.topic.TopicUploadRequest
import com.apexdevs.backend.web.controller.entity.user.AdminApproveRequest
import com.apexdevs.backend.web.controller.entity.user.PendingUserRequestInfo
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.logging.Logger

/**
 * Handles API calls for admins
 * all Ajax calls for the admin operations should be made through here
 */
@RestController
@RequestMapping("/api/admin")
class ApiAdminController(val userOperation: UserOperation, val topicOperation: TopicOperation, val runParametersOperation: RunParametersOperation) {
    /**
     * Collect all approval requests from unapproved users
     * @return: A list of requests, each containing (id, email, display name, motivation, creation date)
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/pending-requests")
    fun getAllUnapprovedUsers(@AuthenticationPrincipal admin: User): List<PendingUserRequestInfo> {
        try {
            // check if current user is admin
            if (!userOperation.userIsAdmin(admin.username))
                throw AccessDeniedException("User is not admin")

            // returns list of all pending requests (which is an empty list in case there are none)
            return userOperation.getPendingRequests()
        } catch (exc: Exception) {
            when (exc) {
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin user not found", exc)
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "User is not admin", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Approve or decline user registration completion by admin
     */
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/approval")
    fun adminUserApproval(@AuthenticationPrincipal admin: User, @RequestBody adminApproveRequest: AdminApproveRequest) {
        try {
            // check if current user is admin
            if (!userOperation.userIsAdmin(admin.username))
                throw AccessDeniedException("User is not admin")

            // call approve or deny depending on request, throw exception if request specifies otherwise
            when (adminApproveRequest.status) {
                UserRequest.Approved -> userOperation.approveUser(adminApproveRequest.email, adminApproveRequest.requestId)
                UserRequest.Denied -> userOperation.declineUser(adminApproveRequest.email, adminApproveRequest.requestId)
                else -> {
                    throw IllegalArgumentException("Admin can only approve or deny users")
                }
            }

            log.info("Admin: ${admin.username} ${adminApproveRequest.status} user: ${adminApproveRequest.email}")
        } catch (exc: Exception) {
            when (exc) {
                is UserNotFoundException, is UserApproveRequestNotFoundException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid AdminApproveRequest sent", exc)
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "User is not admin", exc)
                is IllegalArgumentException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin can only approve or deny users", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Function for handling the topic uploads coming from the front-end
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/topic/upload")
    fun uploadTopic(
        @AuthenticationPrincipal admin: User,
        @RequestBody topicUploadRequest: TopicUploadRequest
    ) {
        try {
            if (!userOperation.userIsAdmin(admin.username))
                throw AccessDeniedException("User: ${admin.username} not allowed to access this route")
            topicOperation.createTopic(Topic(topicUploadRequest.name))
            log.info("Admin: ${admin.username} created new topic: ${topicUploadRequest.name}")
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * Updates the requested run parameters by replacing them with the given run parameters
     * @param admin The (possibly admin) user who calls this endpoint
     * @param id The id of the run parameters to update
     * @param runParametersUploadRequest The data to update the run parameters with
     * @return The updated or created run parameters
     */
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/runparameters/{id}")
    fun updateRunParameterLimits(
        @AuthenticationPrincipal admin: User,
        @PathVariable id: ObjectId,
        @RequestBody runParametersUploadRequest: RunParametersUploadRequest
    ): RunParametersDetails {
        try {
            // Check if the user is an administrator
            if (!userOperation.userIsAdmin(admin.username))
                throw AccessDeniedException("User: ${admin.username} is not allowed to access this route")
            val user = userOperation.getByEmail(admin.username)

            val newRunParameters = RunParameters(
                id,
                runParametersUploadRequest.minLength,
                runParametersUploadRequest.maxLength,
                runParametersUploadRequest.maxDuration,
                runParametersUploadRequest.solutions
            )

            return try {
                // Attempt to get the existing run parameters to check if they already exist
                runParametersOperation.getRunParameters(id)
                // Update the existing run parameters
                val updated = runParametersOperation.updateRunParameters(newRunParameters)
                log.info("Run parameters with id: ${newRunParameters.id} were updated by ${user.displayName}")
                runParametersOperation.getRunParametersDetails(updated)
            } catch (exception: RunParametersNotFoundException) {
                // Run parameters did not exist, add a new entry in the database
                val created = runParametersOperation.createRunParameters(newRunParameters)
                log.info("Run parameters with id: ${newRunParameters.id} were created by ${user.displayName}")
                runParametersOperation.getRunParametersDetails(created)
            }
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, exc.message, exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    companion object {
        val log: Logger = Logger.getLogger("ApiAdminController_Logger")
    }
}
