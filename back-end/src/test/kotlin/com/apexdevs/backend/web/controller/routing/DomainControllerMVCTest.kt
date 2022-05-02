/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.collection.DomainCollection
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.filesystem.DomainFileService
import com.apexdevs.backend.web.controller.entity.domain.DomainDetails
import com.apexdevs.backend.web.controller.entity.domain.DomainRequest
import com.apexdevs.backend.web.controller.entity.domain.DomainVerificationResult
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.mockk
import io.mockk.spyk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@ExtendWith(SpringExtension::class)
@ContextConfiguration(classes = [DomainController::class, SecurityMVCTestConfig::class, SecurityTestConfig::class])
@WebAppConfiguration
class DomainControllerMVCTest(@Autowired val context: WebApplicationContext) {

    @MockkBean(relaxed = true)
    private lateinit var storageServiceDomain: DomainFileService
    @MockkBean(relaxed = true)
    private lateinit var domainOperation: DomainOperation
    @MockkBean(relaxed = true)
    private lateinit var topicOperation: TopicOperation
    @MockkBean(relaxed = true)
    private lateinit var userOperation: UserOperation
    @MockkBean(relaxed = true)
    private lateinit var domainCollection: DomainCollection

    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    private val t = "test"
    private val ow = ObjectMapper().writer().withDefaultPrettyPrinter()

    @Test
    @WithUserDetails("user@test.test")
    fun `Correct domains are displayed for user`() {
        mockMvc.get("/domain/") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Correct domain is displayed by ID`() {
        // prepare test data
        val id = ObjectId()
        val domain = mockk<Domain>()
        val details = DomainDetails(id.toHexString(), t, t, DomainVisibility.Public, listOf(t), t, t, listOf(t), false)

        // set mock returns
        every { domainOperation.getDomain(id) } returns domain
        every { domainOperation.getDomainDetails(domain) } returns details
        every { domain.visibility } returns DomainVisibility.Public
        every { domainOperation.hasUserAccess(any(), DomainAccess.Read, any()) } returns true

        val expected = ow.writeValueAsString(details)
        mockMvc.get("/domain/$id") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { json(expected) }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Domain is updated after patch`() {
        // prepare test data
        val id = ObjectId()

        mockMvc.patch("/domain/$id") {
            param("title", "test")
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    fun `Any authenticated or unauthenticated user can see public domains`() {
        // prepare test data
        val id = ObjectId()

        // set mock returns
        setTestDomains(listOf(Pair(id, DomainVisibility.Public)))
        every { domainOperation.hasAnonymousAccess(any(), DomainAccess.Read) } answers { true }

        mockMvc.get("/domain/$id") {
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    fun `Unauthenticated users cannot see non-public domains`() {
        // prepare test data
        val id1 = ObjectId()
        val id2 = ObjectId()
        val domains = listOf(Pair(id1, DomainVisibility.Private), Pair(id2, DomainVisibility.Archived))

        // set mock returns
        setTestDomains(domains)
        every { domainOperation.hasAnonymousAccess(any(), DomainAccess.Read) } answers { false }

        mockMvc.get("/domain/$id1") {
        }.andExpect {
            status { isUnauthorized() }
        }

        mockMvc.get("/domain/$id2") {
        }.andExpect {
            status { isUnauthorized() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Unauthorized users cannot see non-public domains`() {
        // prepare test data
        val id1 = ObjectId()
        val id2 = ObjectId()
        val domains = listOf(Pair(id1, DomainVisibility.Private), Pair(id2, DomainVisibility.Archived))

        // set mock returns
        setTestDomains(domains)
        every { userOperation.getByEmail(any()) } answers { User("user@test.test", t, t, UserStatus.Approved) }
        every { domainOperation.hasUserAccess(any(), DomainAccess.Read, any()) } answers { false }

        mockMvc.get("/domain/$id1") {
        }.andExpect {
            status { isForbidden() }
        }

        mockMvc.get("/domain/$id2") {
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Exception is thrown when something unexpected happens while updating domain`() {
        // prepare test data
        val id = ObjectId()

        // set mock returns
        every { userOperation.getByEmail(any()) } throws NullPointerException()

        mockMvc.patch("/domain/$id") {
        }.andExpect {
            status { isInternalServerError() }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Exception is thrown when something unexpected happens while retrieving domain`() {
        // prepare test data
        val id = ObjectId()

        // set mock returns
        every { userOperation.getByEmail(any()) } throws NullPointerException()

        mockMvc.get("/domain/$id") {
        }.andExpect {
            status { isInternalServerError() }
        }
    }

    @Test
    fun `Throws exception when domain is not found`() {
        // prepare test data
        val id = ObjectId()

        // set mock returns
        every { domainOperation.getDomain(any()) } throws DomainNotFoundException(this, id, "")

        mockMvc.get("/domain/$id") {
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `Throws exception when something unexpected happens during public domain retrieval`() {
        // set mock returns
        every { domainCollection.getPublicDomains() } throws NullPointerException()

        mockMvc.get("/domain/") {
        }.andExpect {
            status { isInternalServerError() }
        }
    }

    @Test
    fun `Public domains are retrieved correctly`() {
        val domain = spyk(Domain(t, t, t, DomainVisibility.Public, t, t, listOf(t), true))
        val user = User("user@test.test", "test", "TestUser", UserStatus.Approved)

        every { domain.id.toHexString() } returns "testId"

        val domainRequest = DomainRequest(
            domain.id.toHexString(),
            t,
            listOf(t),
            t,
            false,
            user.displayName,
            DomainVerificationResult()
        )

        every { domainCollection.getPublicDomains() } returns listOf(domain)
        every { domainOperation.getTopics(any()) } returns listOf(Topic(t))
        every { domainOperation.getOwner(domain.id) } returns user
        every { userOperation.userIsAdmin(user.email) } returns false

        val expected = ow.writeValueAsString(listOf(domainRequest))
        mockMvc.get("/domain/") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { json(expected) }
        }
    }

    @Test
    fun `Public domains are flagged as official correctly`() {
        val domain = spyk(Domain(t, t, t, DomainVisibility.Public, t, t, listOf(t), true))
        val user = User("user@test.test", "test", "TestUser", UserStatus.Approved)

        every { domain.id.toHexString() } returns "testId"

        val domainRequest = DomainRequest(
            domain.id.toHexString(),
            t,
            listOf(t),
            t,
            true,
            user.displayName,
            DomainVerificationResult()
        )

        every { domainCollection.getPublicDomains() } returns listOf(domain)
        every { domainOperation.getTopics(any()) } returns listOf(Topic(t))
        every { domainOperation.getOwner(domain.id) } returns user
        every { userOperation.userIsAdmin(user.email) } returns true

        val expected = ow.writeValueAsString(listOf(domainRequest))
        mockMvc.get("/domain/") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { json(expected) }
        }
    }

    // helper function for mock returns on test domains
    private fun setTestDomains(domains: List<Pair<ObjectId, DomainVisibility>>) {
        for (d in domains) {
            val domain = mockk<Domain>()
            val id = d.first
            val visibility = d.second

            every { domainOperation.getDomainDetails(domain) } answers { DomainDetails(id.toHexString(), t, t, visibility, listOf(t), t, t, listOf(t), false) }
            every { domainOperation.getDomain(id) } answers { domain }
            every { domain.visibility } answers { visibility }
        }
    }
}
