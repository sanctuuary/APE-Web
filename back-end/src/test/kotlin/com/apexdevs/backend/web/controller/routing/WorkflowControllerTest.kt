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
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import io.mockk.every
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.User
import org.springframework.web.server.ResponseStatusException
import java.security.Principal
import javax.servlet.http.HttpSession

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class WorkflowControllerTest {
    private val userOperation = mockk<UserOperation>()
    private val domainOperation = mockk<DomainOperation>()
    private val apeRequestFactory = mockk<ApeRequestFactory>()
    private val workflowController = WorkflowController(apeRequestFactory, userOperation, domainOperation)

    private val apeRequest = mockk<ApeRequest>()
    private val userSpring = mockk<User>()
    private val authentication = mockk<Authentication>()
    private val session = mockk<HttpSession>()
    private val userLoggedIn = mockk<com.apexdevs.backend.persistence.database.entity.User>()

    private val test = "Test"
    private val id = ObjectId()
    private val domain = mockk<Domain>()

    @BeforeAll
    fun init() {
        every { userSpring.username } returns test
        every { userOperation.getByEmail(any()) } returns userLoggedIn
        every { userLoggedIn.id } returns id
        every { session.id } returns test
        every { domainOperation.getDomain(id) } returns domain
        every { apeRequestFactory.getApeRequest(any(), any()) } returns apeRequest
    }

    @Test
    fun `Anonymous domain access Test`() {
        every { domainOperation.hasAnonymousAccess(domain, DomainAccess.Read) } returns true
        Assertions.assertEquals(Unit, workflowController.getWorkflow(null, id, session))

        every { domainOperation.hasAnonymousAccess(domain, DomainAccess.Read) } returns false
        assertThrows<ResponseStatusException> { workflowController.getWorkflow(null, id, session) }
    }

    @Test
    fun `Authenticated user domain access Test`() {
        every { authentication.principal } returns mockk<Principal>()
        assertThrows<ResponseStatusException> { workflowController.getWorkflow(userSpring, id, session) }

        every { authentication.principal } returns userSpring
        every { domainOperation.hasUserAccess(any(), any(), any()) } returns true
        Assertions.assertEquals(Unit, workflowController.getWorkflow(userSpring, id, session))

        every { domainOperation.hasUserAccess(any(), any(), any()) } returns false
        assertThrows<ResponseStatusException> { workflowController.getWorkflow(userSpring, id, session) }
    }

    @Test
    fun `Bad request Test`() {
        val illegalId = ObjectId()
        every { domainOperation.getDomain(illegalId) } throws DomainNotFoundException(this, illegalId, "Test")

        assertThrows<ResponseStatusException> { workflowController.getWorkflow(null, illegalId, session) }
    }
}
