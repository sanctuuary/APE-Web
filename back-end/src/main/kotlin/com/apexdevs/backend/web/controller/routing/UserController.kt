/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.user.UserInfo
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.server.ResponseStatusException

/**
 * Class for handling the regular calls coming from the front-end
 * All regular data calls for the user should be made through here
 */
@RestController
@RequestMapping("/user")
class UserController(val userOperation: UserOperation) {
    /**
     * Returns user information of requested user
     * A user can only retrieve information about their own account
     * @param user user credentials
     * @param userId user id
     * @return user information
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{userId}")
    fun getUserInformation(@AuthenticationPrincipal user: User, @PathVariable userId: String): UserInfo {
        try {
            // retrieve authenticated user from database
            val authUser = userOperation.getByEmail(user.username)

            // parse object id
            if (!ObjectId.isValid(userId))
                throw IllegalArgumentException("Requested user ID is invalid")

            val pathUserId = ObjectId(userId)

            // user may only view their own account
            if (authUser.id != pathUserId && !userOperation.userIsAdmin(authUser.email))
                throw AccessDeniedException("User not authorized to view this profile")

            // retrieve specified user from database
            val userResult = userOperation.userRepository.findById(pathUserId)

            // make sure result is present
            if (userResult.isEmpty)
                throw UserNotFoundException(this, "User not found in database")

            // get admin status of user
            val isAdmin = userOperation.userIsAdmin(userResult.get().email)

            // create user info as response
            return UserInfo(userResult.get(), isAdmin, true)
        } catch (exc: Exception) {
            when (exc) {
                is HttpClientErrorException.BadRequest, is IllegalArgumentException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested user ID is invalid", exc)
                is UserNotFoundException ->
                    throw ResponseStatusException(HttpStatus.NOT_FOUND, exc.message, exc) // safe message contents
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to view this profile", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun getUsers(@AuthenticationPrincipal user: User): List<UserInfo> {
        try {
            // Check if the user is an administrator
            if (!userOperation.userIsAdmin(user.username))
                throw AccessDeniedException("User: ${user.username} is not allowed to access this route")

            val users = userOperation.approvedUsers()
            return users.map { u -> UserInfo(u, userOperation.userIsAdmin(u.email), false) }
        } catch (exc: Exception) {
            when (exc) {
                is AccessDeniedException ->
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to view this profile", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }
}
