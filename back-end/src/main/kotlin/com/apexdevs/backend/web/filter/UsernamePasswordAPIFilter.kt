/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.filter

import org.json.JSONException
import org.json.JSONObject
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Authentication filter for API login
 * ref: https://stackoverflow.com/questions/19500332/spring-security-and-json-authentication
 */
class UsernamePasswordAPIFilter : UsernamePasswordAuthenticationFilter() {
    /**
     * Performs POST authentication with JSON data
     */
    override fun attemptAuthentication(request: HttpServletRequest?, response: HttpServletResponse?): Authentication {
        if (request == null)
            throw AuthenticationServiceException("Request is null")

        // make sure request method is post
        if (request.method != "POST")
            throw AuthenticationServiceException("Authentication method not supported: ${request.method}")

        if (request.reader == null)
            throw AuthenticationServiceException("Request has no content")

        val requestJSON = request.reader.readText()

        // create token for authentication manager
        val authRequest = UsernamePasswordAuthenticationToken(
            getLoginParameter(requestJSON, usernameParameter),
            getLoginParameter(requestJSON, passwordParameter)
        )

        // store token
        setDetails(request, authRequest)

        // return authentication result
        return authenticationManager.authenticate(authRequest)
    }

    /**
     * Resolve login parameter from JSON
     */
    private fun getLoginParameter(json: String, key: String): String? {
        try {
            // read json as text
            val jsonObject = JSONObject(json)
            // return string by key
            return jsonObject.getString(key)
        } catch (exc: JSONException) {
            // do nothing, return null
        }

        return null
    }
}
