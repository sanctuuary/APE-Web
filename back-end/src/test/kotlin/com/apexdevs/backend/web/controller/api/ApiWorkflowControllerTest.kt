/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.ape.ApeRequest
import com.apexdevs.backend.ape.ApeRequestFactory
import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.ape.entity.workflow.InputData
import com.apexdevs.backend.ape.entity.workflow.Ontology
import com.apexdevs.backend.ape.entity.workflow.WorkflowOutput
import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.filesystem.StorageService
import io.mockk.every
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.User
import org.springframework.web.server.ResponseStatusException
import javax.servlet.http.HttpSession

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ApiWorkflowControllerTest() {

    private val apeRequestFactory = mockk<ApeRequestFactory>(relaxed = true)
    private val storageService = mockk<StorageService>()
    private val userOperation = mockk<UserOperation>()
    private val domainOperation = mockk<DomainOperation>()
    private val apeRequest = mockk<ApeRequest>()
    private val domain = mockk<Domain>()

    private val apiWorkflowController = ApiWorkflowController(
        apeRequestFactory,
        storageService,
        userOperation,
        domainOperation
    )
    private val test = "Test"
    private val id = ObjectId()
    private val session = mockk<HttpSession>()
    private val inputData = InputData(
        input = listOf(),
        expectedOutput = listOf(),
        constraints = listOf(),
        maxDuration = 1,
        maxLength = 1,
        minLength = 1,
        solutions = 1
    )

    @BeforeEach
    fun init() {
        every { apeRequest.domain } returns domain
        every { domain.id } returns id
        every { session.id } returns test
        every { apeRequestFactory.getApeRequest(test) } returns apeRequest
    }

    @Test
    fun getWorkflowData() {
        val ontology = Ontology(mutableListOf())
        every { apeRequest.dataOntology } returns ontology
        val result = apiWorkflowController.getWorkflowData(session)
        assertEquals(ontology, result)
    }

    @Test
    fun getConstraintData() {
        val constraints = listOf<Constraint>()
        every { apeRequest.constraints } returns constraints
        val result = apiWorkflowController.getConstraintData(session)
        assertEquals(constraints, result)
    }

    @Test
    fun runAPEComputation() {
        val inputData = InputData(
            input = listOf(),
            expectedOutput = listOf(),
            constraints = listOf(),
            maxDuration = 1,
            maxLength = 1,
            minLength = 1,
            solutions = 1000
        )
        val mockUser = mockk<User>()
        val mockUserResult = mockk<com.apexdevs.backend.persistence.database.entity.User>()
        val output = mutableListOf<WorkflowOutput>()
        every { apeRequest.getWorkflows(any()) } returns output
        every { storageService.storeConstraint(any(), any(), any()) } returns true
        every { mockUser.username } returns "Test"
        every { userOperation.getByEmail(any()) } returns mockUserResult
        every { mockUserResult.status } returns UserStatus.Approved
        assertEquals(output, apiWorkflowController.runAPEComputation(mockUser, inputData, session))
    }

    @Test
    fun runAPEComputationWrongParams() {
        val inputData = InputData(
            input = listOf(),
            expectedOutput = listOf(),
            constraints = listOf(),
            maxDuration = 1,
            maxLength = 1,
            minLength = 1,
            solutions = 1000
        )
        val mockUser = mockk<User>()
        val mockUserResult = mockk<com.apexdevs.backend.persistence.database.entity.User>()
        val output = mutableListOf<WorkflowOutput>()
        every { apeRequest.getWorkflows(any()) } returns output
        every { storageService.storeConstraint(any(), any(), any()) } returns true
        every { mockUser.username } returns "Test"
        every { userOperation.getByEmail(any()) } returns mockUserResult
        every { mockUserResult.status } returns UserStatus.Pending

        val exc = assertThrows<ResponseStatusException> { apiWorkflowController.runAPEComputation(mockUser, inputData, session) }
        assertEquals(HttpStatus.BAD_REQUEST, exc.status)
    }

    @Test
    fun runAPEComputationWrongParamsNoUser() {
        val inputData = InputData(
            input = listOf(),
            expectedOutput = listOf(),
            constraints = listOf(),
            maxDuration = 1,
            maxLength = 1,
            minLength = 1,
            solutions = 1000
        )
        val mockUser = mockk<User>()
        val mockUserResult = mockk<com.apexdevs.backend.persistence.database.entity.User>()
        val output = mutableListOf<WorkflowOutput>()
        every { apeRequest.getWorkflows(any()) } returns output
        every { storageService.storeConstraint(any(), any(), any()) } returns true
        every { mockUser.username } returns "Test"
        every { userOperation.getByEmail(any()) } returns mockUserResult
        every { mockUserResult.status } returns UserStatus.Approved

        val exc = assertThrows<ResponseStatusException> { apiWorkflowController.runAPEComputation(null, inputData, session) }
        assertEquals(HttpStatus.BAD_REQUEST, exc.status)
    }

    @Test
    fun getCWL() {
        val testValue = "Test"
        val response = mockk<ResponseEntity<Resource>>()
        every { apeRequest.generateAbstractCwl(any()) } returns testValue.toByteArray()
        every { storageService.indexToResponseEntity(any(), any(), any(), any()) } returns response
        every { storageService.resourcesToZip(any(), any()) } returns response

        assertEquals(response, apiWorkflowController.getSolutionAbstractCwl(session, listOf(1, 2)))
    }

    @Test
    fun getBash() {
        val testValue = "Test"
        val response = mockk<ResponseEntity<Resource>>()
        every { apeRequest.generateBash(any()) } returns testValue.toByteArray()
        every { storageService.indexToResponseEntity(any(), any(), any(), any()) } returns response
        every { storageService.resourcesToZip(any(), any()) } returns response

        assertEquals(response, apiWorkflowController.getSolutionBash(session, listOf(1, 2)))
    }

    @Test
    fun getApeRequestFactory() {
        assertEquals(apeRequestFactory, apiWorkflowController.apeRequestFactory)
    }

    @Test
    fun getStorageService() {
        assertEquals(storageService, apiWorkflowController.storageService)
    }

    @Test
    fun getToolData() {
        val ontology = Ontology(mutableListOf())
        every { apeRequest.toolsOntology } returns ontology
        assertEquals(ontology, apiWorkflowController.getToolData(session))
    }
}
