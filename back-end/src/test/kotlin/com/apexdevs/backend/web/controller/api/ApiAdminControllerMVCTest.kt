/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.UserRequest
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.topic.TopicUploadRequest
import com.apexdevs.backend.web.controller.entity.user.AdminApproveRequest
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.google.gson.Gson
import com.ninjasquad.springmockk.MockkBean
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.unmockkObject
import org.bson.types.ObjectId
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@ExtendWith(SpringExtension::class, MockitoExtension::class)
@ContextConfiguration(
    classes = [SecurityMVCTestConfig::class, SecurityTestConfig::class, ApiAdminController::class],
    initializers = [ConfigDataApplicationContextInitializer::class]
)
@WebAppConfiguration
internal class ApiAdminControllerMVCTest(@Autowired val context: WebApplicationContext) {
    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    @MockkBean(relaxed = true)
    private lateinit var userOperation: UserOperation

    private val userRepository = mockk<UserRepository>()

    @MockkBean(relaxed = true)
    private lateinit var topicOperation: TopicOperation

    @MockkBean(relaxed = true)
    private lateinit var runParametersOperation: RunParametersOperation

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert admin user approval route returns ok`() {
        every { userOperation.userIsAdmin(any()) } returns true

        val adminApproveRequest = AdminApproveRequest(ObjectId.get(), "user@test.test", UserRequest.Approved)
        val requestJson = Gson().toJson(adminApproveRequest)

        mockMvc.post("/api/admin/approval") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert user denied returns ok`() {
        every { userOperation.userIsAdmin(any()) } returns true
        every { userOperation.approveUser(any(), any()) } just Runs
        val adminApproveRequest = AdminApproveRequest(ObjectId.get(), "user@test.test", UserRequest.Denied)
        val requestJson = Gson().toJson(adminApproveRequest)

        mockMvc.post("/api/admin/approval") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert user-pending throws error`() {
        every { userOperation.userIsAdmin(any()) } returns true

        val adminApproveRequest = AdminApproveRequest(ObjectId.get(), "user@test.test", UserRequest.Pending)
        val requestJson = Gson().toJson(adminApproveRequest)

        mockMvc.post("/api/admin/approval") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert regular user cannot use user approval route`() {
        val adminApproveRequest = AdminApproveRequest(ObjectId.get(), "user@test.test", UserRequest.Approved)
        val requestJson = Gson().toJson(adminApproveRequest)

        mockMvc.post("/api/admin/approval") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert role admin cannot use user approval route if not admin according to database`() {
        every { userOperation.userIsAdmin(any()) } returns false

        val adminApproveRequest = AdminApproveRequest(ObjectId.get(), "user@test.test", UserRequest.Approved)
        val requestJson = Gson().toJson(adminApproveRequest)

        mockMvc.post("/api/admin/approval") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert admin can use pending requests route`() {
        every { userOperation.userIsAdmin(any()) } returns true
        every { userOperation.getPendingRequests() } returns emptyList()

        mockMvc.get("/api/admin/pending-requests").andExpect {
            status { isOk() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert regular users cannot use pending requests route`() {
        every { userOperation.userIsAdmin(any()) } returns false
        every { userOperation.getPendingRequests() } returns emptyList()

        mockMvc.get("/api/admin/pending-requests").andExpect {
            status { isForbidden() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert non-existing users cannot use pending requests route`() {
        unmockkObject(userOperation)
        every { userRepository.findByEmail(any()) } throws UserNotFoundException(this, "Test")
        every { userOperation.getByEmail(any()) } throws UserNotFoundException(this, "Test")

        mockMvc.get("/api/admin/pending-requests").andExpect {
            status { isForbidden() }
        }
    }

    @Test
    @WithUserDetails("admin@test.test")
    fun `Assert Created is returned after upload`() {
        every { userOperation.userIsAdmin(any()) } returns true
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/admin/topic/upload")
                .content(Gson().toJson(TopicUploadRequest("Test")))
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isCreated)
    }

    @Test
    fun `Assert topic upload not accessible without authorization`() {
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/admin/topic/upload")
                .content(Gson().toJson(TopicUploadRequest("Test")))
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isForbidden)
    }
}
