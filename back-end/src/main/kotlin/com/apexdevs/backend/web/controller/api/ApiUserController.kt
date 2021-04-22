/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.web.controller.entity.user.UserRegister
import org.springframework.dao.DuplicateKeyException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.security.InvalidParameterException
import java.util.logging.Logger

/*
 * Class for handling the Api calls coming from the front-end
 * all Ajax calls for the user should be made through here
 */
@RestController
@RequestMapping("/api/user")
class ApiUserController(val userOperation: UserOperation) {

    /**
     * Login response landing page, authentication is done before this in a security filter
     * @return HttpStatus.OK
     */
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/login")
    fun loginUser() {
        // leave empty
    }

    /**
     * Accepts registration requests as an API call
     * @param: two form entries named "user" and "password"
     * @return: HttpStatus.Created
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    fun registerUser(@RequestBody userRegister: UserRegister) {
        try {
            // register a new user
            userOperation.registerUser(userRegister.username, userRegister.password, userRegister.displayName, userRegister.motivation)
            log.info("User registered with email: ${userRegister.username}")
        } catch (exc: Exception) {
            when (exc) {
                is DuplicateKeyException ->
                    throw ResponseStatusException(HttpStatus.CONFLICT, "Email address has already been registered", exc)
                is InvalidParameterException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address is invalid.", exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    companion object {
        val log: Logger = Logger.getLogger("ApiUserController_Logger")
    }
}
