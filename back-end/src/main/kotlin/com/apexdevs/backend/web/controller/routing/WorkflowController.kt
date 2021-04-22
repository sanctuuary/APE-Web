/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.ape.ApeRequestFactory
import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.UserAccessException
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.server.ResponseStatusException
import javax.servlet.http.HttpSession

/**
 * Class for handling the regular calls coming from the front-end
 * All regular data calls for the workflow should be made through here
 */
@Controller
@RequestMapping("/workflow")
class WorkflowController(val apeRequestFactory: ApeRequestFactory, val userOperation: UserOperation, val domainOperation: DomainOperation) {
    /**
     * Creates APERequest instance
     * @param id id of the domain as stored in the database
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    fun getWorkflow(@AuthenticationPrincipal user: User?, @PathVariable id: ObjectId, session: HttpSession) {
        try {
            val domain = domainOperation.getDomain(id)

            if (!domainOperation.hasAnonymousAccess(domain, DomainAccess.Read)) {
                user?.let {
                    val userResult = userOperation.getByEmail(it.username)

                    if (!domainOperation.hasUserAccess(domain, DomainAccess.Read, userResult.id))
                        throw UserAccessException(this, userResult.id, "User not allowed to access this domain")
                } ?: throw AccessDeniedException("Anonymous user not allowed to access this domain")
            }

            apeRequestFactory.getApeRequest(session.id, domain)
        } catch (exc: Exception) {
            when (exc) {
                is DomainNotFoundException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain not found", exc)
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Anonymous user not allowed to access this domain", exc)
                is UserAccessException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "User not allowed to access this domain", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }
}
