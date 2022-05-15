/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.bson.types.ObjectId
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import java.lang.NullPointerException
import java.util.Optional

@ExtendWith(SpringExtension::class)
@ContextConfiguration(
    classes = [SecurityMVCTestConfig::class, SecurityTestConfig::class, UserController::class],
    initializers = [ConfigDataApplicationContextInitializer::class]
)
@WebAppConfiguration
class UserControllerMVCTest(@Autowired val context: WebApplicationContext) {
    @MockkBean
    private lateinit var userOperation: UserOperation
    @MockkBean
    private lateinit var userRepository: UserRepository

    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert correct user information is shown`() {
        // prepare test data
        val userId = ObjectId.get()
        val user = User(userId, "user@test.test", "test", "test", UserStatus.Approved)

        // match function calls to mocks
        every { userOperation.userRepository } returns userRepository
        every { userOperation.getByEmail(any()) } returns user
        every { userRepository.findById(any()) } returns Optional.of(user)
        every { userOperation.userIsAdmin(any()) } returns false

        mockMvc.get("/user/$userId") {
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `User cannot view information about someone else's account`() {
        // prepare test data
        val user = User("user@test.test", "test", "test", UserStatus.Approved)
        val otherUser = ObjectId()

        // set mock returns
        every { userOperation.userRepository } returns userRepository
        every { userOperation.getByEmail(any()) } returns user
        every { userOperation.userIsAdmin(any()) } returns false
        every { userRepository.findById(any()) } returns Optional.of(user)

        mockMvc.get("/user/$otherUser") {
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `User information is not retrieved when user does not exist in repository`() {
        // prepare test data
        val userId = ObjectId()
        val user = User(userId, "user@test.test", "test", "test", UserStatus.Approved)

        // set mock returns
        every { userOperation.userRepository } returns userRepository
        every { userOperation.getByEmail(any()) } returns user
        every { userRepository.findById(any()) } returns Optional.empty()

        mockMvc.get("/user/$userId") {
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `User information is not retrieved when user id is invalid`() {
        // prepare test data
        val userId = "not a hex string"
        val user = User(ObjectId(), "user@test.test", "test", "test", UserStatus.Approved)

        // set mock returns
        every { userOperation.userRepository } returns userRepository
        every { userOperation.getByEmail(any()) } returns user
        every { userRepository.findById(any()) } returns Optional.of(user)

        mockMvc.get("/user/$userId") {
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Exception is thrown when something unexpected happens during user info retrieval`() {
        val id = ObjectId()

        every { userOperation.getByEmail(any()) } throws NullPointerException()

        mockMvc.get("/user/$id") {
        }.andExpect {
            status { isInternalServerError() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert getUsers is accessible by admins`() {
        val user = User(ObjectId(), "user@test.test", "test", "test", UserStatus.Approved)
        every { userOperation.userIsAdmin(any()) } returns true
        every { userOperation.approvedUsers() } returns listOf(user)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/user/")
        ).andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert getUsers is not accessible by regular users`() {
        val user = User(ObjectId(), "user@test.test", "test", "test", UserStatus.Approved)
        every { userOperation.userIsAdmin(any()) } returns false
        every { userOperation.approvedUsers() } returns listOf(user)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/user/")
        ).andExpect(MockMvcResultMatchers.status().isForbidden)
    }
}
