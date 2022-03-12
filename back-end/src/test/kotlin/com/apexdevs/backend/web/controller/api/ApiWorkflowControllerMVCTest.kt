/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.ape.ApeRequest
import com.apexdevs.backend.ape.ApeRequestFactory
import com.apexdevs.backend.ape.entity.workflow.InputData
import com.apexdevs.backend.ape.entity.workflow.Ontology
import com.apexdevs.backend.ape.entity.workflow.WorkflowOutput
import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.filesystem.StorageService
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkConstructor
import org.bson.types.ObjectId
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@ContextConfiguration(classes = [SecurityMVCTestConfig::class, SecurityTestConfig::class, ApiWorkflowController::class])
@ExtendWith(SpringExtension::class, MockitoExtension::class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@WebAppConfiguration
class ApiWorkflowControllerMVCTest(@Autowired val context: WebApplicationContext) {

    private val id = ObjectId()
    private val apeRequest = mockk<ApeRequest>()
    private val user = mockk<User>()
    private val domain = mockk<Domain>()
    private val inputData = InputData(
        input = listOf(),
        expectedOutput = listOf(),
        constraints = listOf(),
        maxDuration = 1,
        maxLength = 1,
        minLength = 1,
        solutions = 1
    )

    @MockkBean(relaxed = true)
    private lateinit var apeRequestFactory: ApeRequestFactory

    @MockkBean(relaxed = true)
    private lateinit var domainOperation: DomainOperation

    @MockkBean(relaxed = true)
    private lateinit var topicOperation: TopicOperation

    @MockkBean(relaxed = true)
    private lateinit var storageService: StorageService

    @MockkBean
    private lateinit var userOperation: UserOperation

    @MockkBean
    private lateinit var runParametersOperation: RunParametersOperation

    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    private val output = mutableListOf<WorkflowOutput>()
    private val ontology = Ontology(mutableListOf())

    private val mapper = ObjectMapper()
    private val ow = mapper.writer().withDefaultPrettyPrinter()

    @BeforeEach
    fun init() {
        mockkConstructor(ApeRequest::class)
        every { userOperation.getByEmail(any()) } returns user
        every { user.id } returns id
        every { apeRequestFactory.getApeRequest(any()) } returns apeRequest
        every { apeRequest.getWorkflows(any()) } returns output
        every { apeRequest.dataOntology } returns ontology
        every { apeRequest.domain } returns domain
        every { apeRequest.domain.id } returns id
        every { storageService.storeConstraint(any(), any(), any()) } returns true
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert error is handled with wrong input`() {
        val requestJson = ow.writeValueAsString(output)
        mockMvc.post("/api/workflow/run") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isBadRequest }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert workflows are returned after input`() {
        val requestJson = ow.writeValueAsString(inputData)
        mockMvc.post("/api/workflow/run") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isOk }
            content { json(output.toString()) }
        }
    }

    @Test
    @WithUserDetails("user@test.test")
    fun `Assert correct workflow data is retrieved`() {
        val responseJson = ow.writeValueAsString(ontology)
        mockMvc.get("/api/workflow/data") {
        }.andExpect {
            status { isOk }
            content { json(responseJson) }
        }
    }
}
