/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security.authentication

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.web.controller.entity.user.UserInfo
import com.google.gson.Gson
import io.mockk.every
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.core.Authentication
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.io.PrintWriter
import java.io.StringWriter
import java.util.Optional
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.springframework.security.core.userdetails.User as SpringUser

@ExtendWith(SpringExtension::class)
internal class UsernamePasswordAPISuccessHandlerTest {
    @Test
    fun `Assert authentication success handling`() {
        // make mocks
        val request = mockk<HttpServletRequest>(relaxed = true)
        val response = mockk<HttpServletResponse>(relaxed = true)
        val auth = mockk<Authentication>()
        val userOperation = mockk<UserOperation>()
        val userRepository = mockk<UserRepository>()

        // initiate mock data
        val userId = ObjectId.get()
        val stringWriter = StringWriter()

        // set mock returns
        every { response.writer } returns
            PrintWriter(stringWriter)

        every { auth.principal } returns
            SpringUser.withUsername("test").password("test").roles("USER").build()

        every { userOperation.userRepository } returns
            userRepository

        every { userRepository.findByEmail(any()) } returns
            Optional.of(User(userId, "test", "test", "test", UserStatus.Approved))

        every { userOperation.userIsAdmin(any()) } returns
            false

        // make handler and execute method
        val handler = UsernamePasswordAPISuccessHandler(userOperation)
        handler.onAuthenticationSuccess(request, response, auth)

        // convert from response json back to object
        val userInfo = Gson().fromJson(stringWriter.toString(), UserInfo::class.java)

        // make assertions that retrieved object was the same as the inserted object
        assert(ObjectId(userInfo.userId) == userId)
        assert(userInfo.email == "test")
        assert(userInfo.displayName == "test")
        assert(userInfo.status == UserStatus.Approved)
        assert(!userInfo.isAdmin)
    }
}
