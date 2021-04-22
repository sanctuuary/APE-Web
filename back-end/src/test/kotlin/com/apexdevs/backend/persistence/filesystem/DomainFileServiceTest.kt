/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.filesystem

import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.database.entity.User
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.mockkConstructor
import io.mockk.verify
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.core.io.FileSystemResource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileOutputStream
import java.nio.file.Path

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class DomainFileServiceTest {

    private val mockLocation = mockk<Path>()
    private val mockUser = mockk<User>()
    private val mockFileService = mockk<FileService>()
    private val mockDomainOperation = mockk<DomainOperation>()
    private val fileSystemStorage = DomainFileService(mockFileService, mockDomainOperation)
    private val mockkOutputStream = mockk<FileOutputStream>()
    private val domainId = ObjectId()

    @BeforeAll
    fun initTests() {
        every { mockFileService.rootLocation } returns mockLocation
        every { mockFileService.createFile(any(), any()) } returns mockkOutputStream
        every { mockkOutputStream.write(any<ByteArray>()) } just Runs
        every { mockkOutputStream.close() } just Runs
        every { mockUser.id } returns domainId
    }

    @Test
    fun store() {
        val mockFile = mockk<MultipartFile>()
        val byteArray = ByteArray(1)
        every { mockFile.isEmpty } returns false
        every { mockFile.bytes } returns byteArray
        val fileType = FileTypes.Ontology

        assertEquals(true, fileSystemStorage.storeDomainFile(domainId, mockFile, fileType))

        verify { mockFileService.createFile(domainId, fileType) }
        verify { mockkOutputStream.write(byteArray) }
    }

    @Test
    fun `exception thrown with empty file`() {
        val mockFile = mockk<MultipartFile>()
        every { mockFile.isEmpty } returns true
        val fileType = FileTypes.Ontology
        assertEquals(false, fileSystemStorage.storeDomainFile(domainId, mockFile, fileType))
    }

    @Test
    fun storeConstraint() {
        val constraints = listOf(Constraint("use_m"))
        val fileType = FileTypes.Constraints
        assertEquals(true, fileSystemStorage.storeConstraint(domainId, fileType, constraints))
        verify { mockFileService.createFile(domainId, fileType) }
        verify { mockkOutputStream.write(any<ByteArray>()) }

        assertEquals(true, fileSystemStorage.storeConstraint(domainId, fileType, null))
        verify { mockFileService.createFile(domainId, fileType) }
        verify { mockkOutputStream.write(any<ByteArray>()) }
    }

    @Disabled
    @Test
    fun loadFile() {
        val mockFile = mockk<File>(relaxed = true)
        every { mockDomainOperation.getDomain(any()) } returns mockk()
        every { mockDomainOperation.hasAnonymousAccess(any(), any()) } returns true
        every { mockFileService.loadFile(any(), any()) } returns mockFile
        mockkConstructor(FileSystemResource::class)
        every { anyConstructed<FileSystemResource>().contentLength() } returns 1
        val resource = FileSystemResource(mockFile)
        val expected = ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=\"ontology.owl\"")
            .contentLength(resource.contentLength())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)
        assertEquals(expected, fileSystemStorage.loadFilesAsZippedResponse(ObjectId(), listOf(FileTypes.Ontology), mockUser, "Test"))
    }
}
