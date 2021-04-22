/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.TopicOperation
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.collection.DomainCollection
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.TopicNotFoundException
import com.apexdevs.backend.persistence.exception.UserAccessException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.persistence.filesystem.StorageService
import com.apexdevs.backend.web.controller.entity.domain.DomainUploadRequest
import com.apexdevs.backend.web.controller.entity.domain.DomainWithAccessResponse
import com.mongodb.MongoException
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.mockkConstructor
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.User
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApiDomainControllerTest {

    private val mockStorageService = mockk<StorageService>()
    private val mockDomainOperation = mockk<DomainOperation>()
    private val mockUserOperation = mockk<UserOperation>()
    private val mockTopicOperation = mockk<TopicOperation>()
    private val mockDomainCollection = mockk<DomainCollection>()
    private val mockSpringUser = mockk<User>()
    private val mockFile = mockk<MultipartFile>()
    private val mockUser = mockk<com.apexdevs.backend.persistence.database.entity.User>()
    private val id = ObjectId()

    private val apiDomainController = ApiDomainController(
        mockStorageService,
        mockDomainOperation,
        mockUserOperation,
        mockTopicOperation,
        mockDomainCollection
    )

    @BeforeEach
    fun init() {
        every { mockSpringUser.username } returns "Test"
        every { mockUser.status } returns UserStatus.Pending
        every { mockUser.id } returns ObjectId()
        every { mockUser.email } returns "user@test.test"
        every { mockUserOperation.getByEmail(any()) } returns mockUser
    }

    /**
     * Method: uploadDomain()
     */
    @Test
    fun `Bad request error when incomplete upload`() {
        val domainUploadRequest = DomainUploadRequest(null, null, null, null, null, null, null, null)

        val exc = assertThrows<ResponseStatusException> { apiDomainController.uploadDomain(mockSpringUser, domainUploadRequest, mockFile, mockFile, mockFile, mockFile) }
        assertEquals(HttpStatus.BAD_REQUEST, exc.status)
    }

    /**
     * Method: uploadDomain()
     */
    @Test
    fun `Bad request when topic not found`() {
        val id = ObjectId()
        val domainUploadRequest = DomainUploadRequest("Test", "Test", listOf(id), "Test", "Test", listOf(), DomainVisibility.Public, true)

        every { mockDomainOperation.createDomain(any(), any()) } just Runs
        every { mockTopicOperation.assignToDomain(any(), any()) } throws TopicNotFoundException(id, "test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.uploadDomain(mockSpringUser, domainUploadRequest, mockFile, mockFile, mockFile, mockFile) }
        assertEquals(HttpStatus.BAD_REQUEST, exc.status)
    }

    /**
     * Method: uploadDomain()
     */
    @Test
    fun `Bad request when user not found`() {
        val domainUploadRequest = DomainUploadRequest("Test", "Test", listOf(), "Test", "Test", listOf(), DomainVisibility.Public, true)

        every { mockUserOperation.getByEmail(any()) } throws UserNotFoundException(this, "Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.uploadDomain(mockSpringUser, domainUploadRequest, mockFile, mockFile, mockFile, mockFile) }
        assertEquals(HttpStatus.UNAUTHORIZED, exc.status)
    }

    /**
     * Method: uploadDomain()
     */
    @Test
    fun `server error when mongo fail`() {
        val domainUploadRequest = DomainUploadRequest("Test", "Test", listOf(), "Test", "Test", listOf(), DomainVisibility.Public, true)

        every { mockUserOperation.getByEmail(any()) } throws MongoException("Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.uploadDomain(mockSpringUser, domainUploadRequest, mockFile, mockFile, mockFile, mockFile) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exc.status)
    }

    /**
     * Method: uploadDomain()
     */
    @Test
    fun `Upload domain`() {
        mockkConstructor(Domain::class)
        every { anyConstructed<Domain>().id } returns id
        every { mockDomainOperation.createDomain(any(), any()) } just Runs
        every { mockTopicOperation.assignToDomain(any(), any()) } just Runs
        every { mockStorageService.storeDomainFile(any(), any(), any()) } returns true
        every { mockStorageService.initDomainDirectories(any()) } returns true

        val domainUploadRequest = DomainUploadRequest("Test", "Test", listOf(id), "Test", "Test", listOf(), DomainVisibility.Public, true)
        assertEquals(id.toString(), apiDomainController.uploadDomain(mockSpringUser, domainUploadRequest, mockFile, mockFile, mockFile, mockFile))
    }

    /**
     * Method: downloadToolsAnnotations()
     */
    @Test
    fun `download tools`() {
        val domain = mockk<Domain>()
        val resource = mockk<Resource>()
        val expected = ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=\"toolsAnnotations.json\"")
            .contentLength(1)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)

        every { mockDomainOperation.getDomain(any()) } returns domain
        every { domain.visibility } returns DomainVisibility.Private
        every { mockDomainOperation.hasUserAccess(any(), any(), any()) } returns true
        every { mockDomainOperation.hasAnonymousAccess(domain, any()) } returns false
        every { mockStorageService.loadFileAsResponse(any(), any(), mockUser) } returns expected

        assertEquals(expected, apiDomainController.downloadToolsAnnotations(mockSpringUser, ObjectId()))
    }

    /**
     * Method: downloadToolsAnnotations()
     */
    @Test
    fun `user access exception tools download`() {
        every { mockStorageService.loadFileAsResponse(any(), any(), any()) } throws UserAccessException(this, ObjectId(), "Test")
        val exc = assertThrows<ResponseStatusException> { apiDomainController.downloadToolsAnnotations(mockSpringUser, ObjectId()) }
        assertEquals(HttpStatus.UNAUTHORIZED, exc.status)
    }

    /**
     * Method: downloadToolsAnnotations()
     */
    @Test
    fun `unauthorized exception when un-authenticated tools download`() {
        every { mockStorageService.loadFileAsResponse(any(), any(), any()) } throws UserAccessException(this, ObjectId(), "Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.downloadToolsAnnotations(null, ObjectId()) }
        assertEquals(HttpStatus.UNAUTHORIZED, exc.status)
    }

    /**
     * Method: downloadToolsAnnotations()
     */
    @Test
    fun `server error when mongo fail tools download`() {
        every { mockStorageService.loadFileAsResponse(any(), any(), any()) } throws MongoException("Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.downloadToolsAnnotations(mockSpringUser, ObjectId()) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exc.status)
    }

    /**
     * Method: downloadToolsAnnotations()
     */
    @Test
    fun `ok when public access tools download`() {
        val domain = mockk<Domain>()
        val resource = mockk<Resource>()
        val expected = ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=\"toolsAnnotations.json\"")
            .contentLength(1)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)

        every { mockDomainOperation.getDomain(any()) } returns domain
        every { domain.visibility } returns DomainVisibility.Public
        every { mockStorageService.loadFileAsResponse(any(), any(), mockUser) } returns expected
        every { mockDomainOperation.hasAnonymousAccess(domain, any()) } returns true

        assertEquals(expected, apiDomainController.downloadToolsAnnotations(mockSpringUser, ObjectId()))
    }

    /**
     * Method: downloadOntology()
     */
    @Test
    fun `ok when private download ontology`() {
        val domain = mockk<Domain>()
        val resource = mockk<Resource>()
        val expected = ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=\"ontology.owl\"")
            .contentLength(1)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)

        every { mockDomainOperation.getDomain(any()) } returns domain
        every { domain.visibility } returns DomainVisibility.Private
        every { mockDomainOperation.hasUserAccess(any(), any(), any()) } returns true
        every { mockStorageService.loadFileAsResponse(any(), any(), mockUser) } returns expected
        every { mockDomainOperation.hasAnonymousAccess(domain, any()) } returns false

        assertEquals(expected, apiDomainController.downloadOntology(mockSpringUser, ObjectId()))
    }

    /**
     * Method: downloadOntology()
     */
    @Test
    fun `user access exception ontology download`() {

        every { mockStorageService.loadFileAsResponse(any(), any(), any()) } throws UserAccessException(this, ObjectId(), "Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.downloadOntology(mockSpringUser, ObjectId()) }
        assertEquals(HttpStatus.UNAUTHORIZED, exc.status)
    }

    /**
     * Method: downloadOntology()
     */
    @Test
    fun `server error when mongo fail ontology download`() {
        every { mockStorageService.loadFileAsResponse(any(), any(), any()) } throws MongoException("Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.downloadOntology(mockSpringUser, ObjectId()) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exc.status)
    }

    /**
     * Method: downloadOntology()
     */
    @Test
    fun `ok when public access ontology download`() {
        val domain = mockk<Domain>()
        val resource = mockk<Resource>()
        val expected = ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=\"ontology.owl\"")
            .contentLength(1)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)

        every { mockDomainOperation.getDomain(any()) } returns domain
        every { domain.visibility } returns DomainVisibility.Public
        every { mockStorageService.loadFileAsResponse(any(), any(), mockUser) } returns expected
        every { mockDomainOperation.hasAnonymousAccess(domain, any()) } returns true

        assertEquals(expected, apiDomainController.downloadOntology(mockSpringUser, ObjectId()))
    }

    /**
     * Method: downloadOntology()
     */
    @Test
    fun `unauthorized exception when un-authenticated ontology download`() {
        every { mockStorageService.loadFileAsResponse(any(), any(), any()) } throws UserAccessException(this, ObjectId(), "Test")
        val exc = assertThrows<ResponseStatusException> { apiDomainController.downloadOntology(null, ObjectId()) }
        assertEquals(HttpStatus.UNAUTHORIZED, exc.status)
    }

    /**
     * Method: getDomainsWithUserAccess
     */
    @Test
    fun `Forbidden error when requesting wrong user`() {
        val domainAccess = listOf(DomainAccess.Read)

        every { mockUser.id } returns ObjectId()

        val exc = assertThrows<ResponseStatusException> { apiDomainController.getDomainsWithUserAccess(mockSpringUser, id, domainAccess) }
        assertEquals(HttpStatus.FORBIDDEN, exc.status)
    }

    /**
     * Method: getDomainsWithUserAccess
     */
    @Test
    fun `Get domains with user access`() {
        val topic = mockk<Topic>()
        val domainAccess = listOf(DomainAccess.Read)
        val domain = Domain("Test", "Test", "Test", DomainVisibility.Public, "Test", "Test", listOf(), true)
        val userDomainAccess = listOf(UserDomainAccess(mockUser.id, domain.id, DomainAccess.Read))
        val expected = mutableListOf(
            DomainWithAccessResponse(
                domain.id.toHexString(),
                domain.name,
                domain.description,
                domain.visibility.toString(),
                listOf("Test"),
                id.toHexString(),
                DomainAccess.Read.toString()
            )
        )

        every { mockUser.id } returns id
        every { mockDomainCollection.getDomainsByUserAndAccess(mockUser, domainAccess) } returns userDomainAccess
        every { mockDomainOperation.getTopics(any()) } returns listOf(topic)
        every { topic.name } returns "Test"
        every { mockDomainOperation.getDomain(any()) } returns domain

        assertEquals(expected, apiDomainController.getDomainsWithUserAccess(mockSpringUser, id, domainAccess))
    }

    /**
     * Method: getDomainsWithUserAccess
     */
    @Test
    fun `Get empty list when domain is null`() {
        val topic = mockk<Topic>()
        val domainAccess = listOf(DomainAccess.Read)
        val mockUserDomainAccess = mockk<UserDomainAccess>()
        val listUserDomainAccess = listOf(mockUserDomainAccess)
        val expected = mutableListOf<DomainWithAccessResponse>()

        every { mockUser.id } returns id
        every { mockDomainCollection.getDomainsByUserAndAccess(mockUser, domainAccess) } returns listUserDomainAccess
        every { mockUserDomainAccess.domainId } returns ObjectId.get()
        every { mockDomainOperation.getTopics(any()) } returns listOf(topic)
        every { topic.name } returns "Test"
        every { mockDomainOperation.getDomain(any()) } throws DomainNotFoundException(this, ObjectId.get(), "Test domain not found")

        assertEquals(expected, apiDomainController.getDomainsWithUserAccess(mockSpringUser, id, domainAccess))
    }

    /**
     * Method: getDomainsWithUserAccess
     */
    @Test
    fun `server error when mongo fail at access`() {
        val domainAccess = listOf(DomainAccess.Read)

        every { mockUserOperation.getByEmail(any()) } throws MongoException("Test")

        val exc = assertThrows<ResponseStatusException> { apiDomainController.getDomainsWithUserAccess(mockSpringUser, id, domainAccess) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exc.status)
    }
}
