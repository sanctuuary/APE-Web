/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.UserRequest
import com.apexdevs.backend.persistence.exception.UserApproveRequestNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.topic.TopicUploadRequest
import com.apexdevs.backend.web.controller.entity.user.AdminApproveRequest
import com.apexdevs.backend.web.controller.entity.user.PendingUserRequestInfo
import com.mongodb.MongoException
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.User
import org.springframework.web.server.ResponseStatusException

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApiAdminControllerTest {

    private val mockUserOperation = mockk<UserOperation>()
    private val mockTopicOperation = mockk<TopicOperation>()
    private val mockAdmin = mockk<User>()
    private val apiAdminController = ApiAdminController(mockUserOperation, mockTopicOperation)

    @BeforeAll
    fun init() {
        every { mockAdmin.username } returns "Test"
    }

    @Test
    fun `get All UnapprovedUsers as admin`() {
        val pendingRequests = listOf<PendingUserRequestInfo>()

        every { mockUserOperation.userIsAdmin(any()) } returns true
        every { mockUserOperation.getPendingRequests() } returns pendingRequests

        assertEquals(pendingRequests, apiAdminController.getAllUnapprovedUsers(mockAdmin))
    }

    @Test
    fun `access denied as regular user`() {
        every { mockUserOperation.userIsAdmin(any()) } returns false

        val exception = assertThrows<ResponseStatusException> { apiAdminController.getAllUnapprovedUsers(mockAdmin) }
        assertEquals(HttpStatus.FORBIDDEN, exception.status)
    }

    @Test
    fun `unauthorized as non-existing user`() {
        every { mockUserOperation.userIsAdmin(any()) } throws UserNotFoundException(this, "Test")

        val exception = assertThrows<ResponseStatusException> { apiAdminController.getAllUnapprovedUsers(mockAdmin) }
        assertEquals(HttpStatus.UNAUTHORIZED, exception.status)
    }

    @Test
    fun `get pending request throws server error`() {
        every { mockUserOperation.getPendingRequests() } throws MongoException("Test")

        val exception = assertThrows<ResponseStatusException> { apiAdminController.getAllUnapprovedUsers(mockAdmin) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.status)
    }

    @Test
    fun `bad-request as non-existing user`() {
        val adminApproveRequest = AdminApproveRequest(ObjectId(), "Test", UserRequest.Approved)

        every { mockUserOperation.userIsAdmin(any()) } throws UserNotFoundException(this, "Test")

        val exception = assertThrows<ResponseStatusException> { apiAdminController.adminUserApproval(mockAdmin, adminApproveRequest) }
        assertEquals(HttpStatus.BAD_REQUEST, exception.status)
    }

    @Test
    fun `bad-request as invalid approveRequest user`() {
        val adminApproveRequest = AdminApproveRequest(ObjectId(), "Test", UserRequest.Approved)

        every { mockUserOperation.approveUser(any(), any()) } throws UserApproveRequestNotFoundException(this, "Test")
        every { mockUserOperation.userIsAdmin(any()) } returns true

        val exception = assertThrows<ResponseStatusException> { apiAdminController.adminUserApproval(mockAdmin, adminApproveRequest) }
        assertEquals(HttpStatus.BAD_REQUEST, exception.status)
    }

    @Test
    fun `server-error as mongo fail get user`() {
        val adminApproveRequest = AdminApproveRequest(ObjectId(), "Test", UserRequest.Approved)

        every { mockUserOperation.userIsAdmin(any()) } throws MongoException("Test")

        val exception = assertThrows<ResponseStatusException> { apiAdminController.adminUserApproval(mockAdmin, adminApproveRequest) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.status)
    }

    @Test
    fun `upload topic as admin`() {
        val topic = TopicUploadRequest("Test")

        every { mockUserOperation.userIsAdmin(any()) } returns true
        every { mockTopicOperation.createTopic(any()) } just Runs

        assertEquals(Unit, apiAdminController.uploadTopic(mockAdmin, topic))
    }

    @Test
    fun `upload topic error as user`() {
        val topic = TopicUploadRequest("Test")

        every { mockUserOperation.userIsAdmin(any()) } returns false

        val exception = assertThrows<ResponseStatusException> { apiAdminController.uploadTopic(mockAdmin, topic) }
        assertEquals(HttpStatus.UNAUTHORIZED, exception.status)
    }
    @Test
    fun `server-error as mongo fail topic upload`() {
        val topic = TopicUploadRequest("Test")

        every { mockUserOperation.userIsAdmin(any()) } returns true
        every { mockTopicOperation.createTopic(any()) } throws MongoException("Test")

        val exception = assertThrows<ResponseStatusException> { apiAdminController.uploadTopic(mockAdmin, topic) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.status)
    }
}
