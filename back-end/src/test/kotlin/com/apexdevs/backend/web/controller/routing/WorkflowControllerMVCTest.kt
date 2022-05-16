/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.ape.ApeRequest
import com.apexdevs.backend.ape.ApeRequestFactory
import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.filesystem.StorageService
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.User
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import java.lang.NullPointerException

@ContextConfiguration(
    classes = [SecurityMVCTestConfig::class, SecurityTestConfig::class, WorkflowController::class],
    initializers = [ConfigDataApplicationContextInitializer::class]
)
@ExtendWith(SpringExtension::class, MockitoExtension::class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@WebAppConfiguration
class WorkflowControllerMVCTest(@Autowired val context: WebApplicationContext) {
    @MockkBean(relaxed = true)
    private lateinit var userOperation: UserOperation
    @MockkBean
    private lateinit var domainOperation: DomainOperation
    @MockkBean(relaxed = true)
    private lateinit var storageService: StorageService
    @MockkBean(relaxed = true)
    private lateinit var apeRequestFactory: ApeRequestFactory

    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    private val apeRequest = mockk<ApeRequest>()
    private val userSpring = mockk<User>()
    private val userLoggedIn = mockk<com.apexdevs.backend.persistence.database.entity.User>()
    private val t = "test"
    private val id = ObjectId()
    private val domain = mockk<Domain>()

    @BeforeAll
    fun init() {
        every { userSpring.username } returns t
        every { userOperation.getByEmail(any()) } returns userLoggedIn
        every { userLoggedIn.id } returns id
        every { apeRequestFactory.getApeRequest(any(), any()) } returns apeRequest
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Correct workflow is shown based on domain`() {
        // set mock returns
        every { domainOperation.hasAnonymousAccess(any(), any()) } returns true
        every { domainOperation.getDomain(any()) } returns domain

        mockMvc.get("/workflow/$id") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    fun `Exception is thrown when domain id is invalid`() {
        // prepare test data
        val badId = "not a hex string"

        mockMvc.get("/workflow/$badId") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Exception is thrown when user doesn't have access to domain`() {
        // set mock returns
        every { domainOperation.hasAnonymousAccess(any(), any()) } returns false
        every { domainOperation.hasUserAccess(any(), any(), any()) } returns false
        every { domainOperation.getDomain(any()) } returns domain

        mockMvc.get("/workflow/$id") {
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `Exception is thrown when anonymous user doesn't have access to domain`() {
        // set mock returns
        every { domainOperation.hasUserAccess(any(), any(), any()) } returns true
        every { domainOperation.hasAnonymousAccess(any(), any()) } returns false
        every { domainOperation.getDomain(any()) } returns domain

        mockMvc.get("/workflow/$id") {
        }.andExpect {
            status { isUnauthorized() }
        }
    }

    @Test
    fun `Exception is thrown when domain isn't found`() {
        // set mock returns
        every { domainOperation.hasAnonymousAccess(any(), any()) } returns true
        every { domainOperation.getDomain(any()) } throws DomainNotFoundException(this, ObjectId(), "test")

        mockMvc.get("/workflow/$id") {
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `Exception is thrown when something unexpected happens during workflow retrieval`() {
        // set mock returns
        every { domainOperation.getDomain(any()) } throws NullPointerException()

        mockMvc.get("/workflow/$id") {
        }.andExpect {
            status { isInternalServerError() }
        }
    }
}
