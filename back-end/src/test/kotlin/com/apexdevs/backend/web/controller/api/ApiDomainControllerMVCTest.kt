/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.collection.DomainCollection
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import com.apexdevs.backend.persistence.filesystem.DomainFileService
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.bson.types.ObjectId
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.multipart
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import java.util.Optional

@ExtendWith(SpringExtension::class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ContextConfiguration(classes = [SecurityMVCTestConfig::class, SecurityTestConfig::class, ApiDomainController::class])
@WebAppConfiguration
class ApiDomainControllerMVCTest(@Autowired val context: WebApplicationContext, @Autowired val userDetailsService: UserDetailsService) {
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
    @MockkBean(relaxed = true)
    private lateinit var topicRepository: TopicRepository

    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()
    private val test = "Test"
    private val topicId = ObjectId()

    @BeforeAll
    fun init() {
        every { topicRepository.findById(topicId) } returns Optional.of(Topic(topicId, "Test"))
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert Created is returned after upload`() {
        every { storageServiceDomain.initDomainDirectories(any()) } returns true
        every { storageServiceDomain.storeDomainFile(any(), any(), any()) } returns true
        val ontology = MockMultipartFile("ontology", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())
        val toolsAnnotations = MockMultipartFile("toolsAnnotations", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())
        val useCaseRunConfig = MockMultipartFile("useCaseRunConfig", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())
        val useCaseConstraints = MockMultipartFile("useCaseConstraints", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())

        val result = mockMvc.multipart("/api/domain/upload") {
            param("title", "test")
            param("description", "test")
            param("topics", topicId.toHexString())
            param("ontologyPrefix", "test")
            param("toolsTaxonomyRoot", "test")
            param("dataDimensionsTaxonomyRoots", "test")
            param("visibility", "Public")
            param("strictToolsAnnotations", true.toString())
            file(ontology)
            file(toolsAnnotations)
            file(useCaseRunConfig)
            file(useCaseConstraints)
        }.andExpect {
            // check if result is what we wanted
            status { isCreated }
        }.andReturn()

        // assert that returned domain id is valid
        assert(ObjectId.isValid(result.response.contentAsString))
    }

    @Test
    fun `Assert domain upload not accessible without authorization`() {
        val mockOntology = MockMultipartFile("ontology", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())
        val mockToolsAnnotation = MockMultipartFile("toolsAnnotations", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())

        mockMvc.multipart("/api/domain/upload") {
            param("title", "test")
            param("description", "test")
            param("topics", topicId.toHexString())
            param("visibility", "Public")
            file(mockOntology)
            file(mockToolsAnnotation)
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            // check if result is what we wanted
            status { isForbidden }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert no content is returned after empty file`() {
        val mockFile = MockMultipartFile("toolsAnnotations", "orig", MediaType.TEXT_MARKDOWN_VALUE, "".toByteArray())
        val mockToolsAnnotation = MockMultipartFile("toolsAnnotations", "orig", MediaType.TEXT_MARKDOWN_VALUE, "bar".toByteArray())

        mockMvc.multipart("/api/domain/upload") {
            param("title", "test")
            param("description", "test")
            param("topics", topicId.toHexString())
            param("ontologyPrefix", "test")
            param("toolsTaxonomyRoot", "test")
            param("dataDimensionsTaxonomyRoots", "test")
            param("visibility", "Public")
            file(mockFile)
            file(mockToolsAnnotation)
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isBadRequest }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert get domains with user access is ok`() {
        // create test data
        val userId = ObjectId.get()

        // set mock results
        every { userOperation.getByEmail(any()) } returns
            User(userId, "user@test.test", "test", "test", UserStatus.Approved)

        // perform get on route
        mockMvc.perform(
            get("/api/domain/with-user-access")
                .param("userId", userId.toHexString())
                .param("accessRights", DomainAccess.Owner.toString(), DomainAccess.ReadWrite.toString(), DomainAccess.Read.toString())
        ).andExpect(status().isOk)
    }
}
