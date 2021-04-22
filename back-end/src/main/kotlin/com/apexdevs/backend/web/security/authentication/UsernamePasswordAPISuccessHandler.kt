/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security.authentication

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.web.controller.entity.user.UserInfo
import org.json.JSONObject
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.User
import org.springframework.security.web.RedirectStrategy
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Username and password API success handler
 * Fill authentication response with UserInfo on success
 *
 * @param userOperation (autowired)
 */
class UsernamePasswordAPISuccessHandler(val userOperation: UserOperation) : SimpleUrlAuthenticationSuccessHandler() {
    init {
        // disable automated redirect
        redirectStrategy = NoRedirectStrategy()
    }

    /**
     * Runs on authentication success
     * Injects UserInfo in response or null if user not found
     * @param request servlet containing request information
     * @param response servlet containing response information
     * @param auth Authentication containing newly authenticated user
     */
    override fun onAuthenticationSuccess(request: HttpServletRequest?, response: HttpServletResponse?, auth: Authentication?) {
        // maintain superclass success functionality
        super.onAuthenticationSuccess(request, response, auth)

        // check if authorization went ok
        if (auth != null) {
            // get and cast principal to APEUser
            val principal = auth.principal
            if (principal is User) {
                // find corresponding user in database
                val userResult = userOperation.userRepository.findByEmail(principal.username)

                // check if database entry is found
                if (userResult.isPresent) {
                    // retrieve admin status of user
                    val isAdmin = userOperation.userIsAdmin(principal.username)

                    // wrap user result into JSON object
                    val json = JSONObject.wrap(UserInfo(userResult.get(), isAdmin))
                    // write JSON into response
                    response?.writer?.write(json.toString())
                } else {
                    // if no database entry is found, write null with code 'internal server error (500)' instead
                    response?.writer?.write("null")
                    response?.status = 500
                }
            }
        }
    }

    /**
     * Empty redirect instance. Removes redirect link from success handler above
     */
    internal class NoRedirectStrategy : RedirectStrategy {
        override fun sendRedirect(request: HttpServletRequest?, response: HttpServletResponse?, url: String?) {
            // no redirect
        }
    }
}
