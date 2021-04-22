/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.filter

import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import org.junit.jupiter.api.Test
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.TestingAuthenticationToken
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import java.io.BufferedReader
import java.io.StringReader
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

internal class UsernamePasswordAPIFilterTest {
    @Test
    fun `Assert authentication attempt handling`() {
        // create mocks
        val request = mockk<HttpServletRequest>(relaxed = true)
        val response = mockk<HttpServletResponse>()
        val authenticationManager = mockk<AuthenticationManager>()

        // create request content
        val reader = BufferedReader(StringReader("{\"username\":\"test@test.com\",\"password\":\"test\"}"))

        // set mocking returns
        every { request.method } returns
            "POST"

        every { request.reader } returns
            reader

        // create capture on authentication manager authenticate
        val authSlot = slot<Authentication>()
        every {
            authenticationManager.authenticate(capture(authSlot))
        } returns
            TestingAuthenticationToken(null, null)

        // create filter and attempt authentication
        val filter = UsernamePasswordAPIFilter()
        filter.setAuthenticationManager(authenticationManager)
        filter.attemptAuthentication(request, response)

        // assert parameters is captured and test this captured parameter
        assert(authSlot.isCaptured)

        val auth = authSlot.captured
        assert(auth is UsernamePasswordAuthenticationToken)
        assert(auth.name == "test@test.com")
        assert(auth.credentials == "test")
    }
}
