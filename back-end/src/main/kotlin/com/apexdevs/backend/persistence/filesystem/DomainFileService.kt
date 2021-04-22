/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.filesystem

import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.persistence.DomainOperation
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.exception.UserAccessException
import org.bson.types.ObjectId
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.BufferedOutputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/**
 * Class that provides interacts as a layer for the controllers to retrieve and send files to the front-end, or store files.
 */
@Service
class DomainFileService @Autowired constructor(val fileService: FileService, val domainOperation: DomainOperation) : StorageService {

    /**
     * Initializes the directories to be able to store the domain files
     * @param domainId id of the domain as in the DB
     */
    override fun initDomainDirectories(domainId: ObjectId): Boolean {
        return File(fileService.rootLocation.resolve("$domainId").toString()).mkdirs() &&
            File(fileService.rootLocation.resolve("$domainId/core").toString()).mkdirs() &&
            File(fileService.rootLocation.resolve("$domainId/use_cases").toString()).mkdirs()
    }

    /**
     * Deletes the directories of the domain
     * @param domainId id of the domain as in the DB
     */
    override fun deleteDomainDirectories(domainId: ObjectId): Boolean {
        return fileService.deleteAll(domainId)
    }

    /**
     * checks if the caller has access to the provided domain
     * @param domainId the id of the domain
     * @param user  the user object, may be null
     */
    override fun hasAccessToDomain(domainId: ObjectId, user: User?) {
        val domain = domainOperation.getDomain(domainId)

        if (!domainOperation.hasAnonymousAccess(domain, DomainAccess.Read)) {
            user?.let {
                if (!domainOperation.hasUserAccess(domain, DomainAccess.Read, it.id))
                    throw UserAccessException(this, it.id, "User not authorized to retrieve domain")
            } ?: throw AccessDeniedException("Anonymous user not allowed to access this domain")
        }
    }

    /**
     * Store a MultiPartFile in the appropriate folder based on domain
     * @param file a MultiPartFile to be stored
     * @param domainId id of the domain the file belongs to
     * @param fileType type of file, Ontology, toolsAnnotations or constraints
     */
    @Throws(StorageException::class)
    override fun storeDomainFile(domainId: ObjectId, file: MultipartFile, fileType: FileTypes): Boolean {
        if (file.isEmpty) {
            return false
        }
        try {
            val fileOutputStream = fileService.createFile(domainId, fileType)
            fileOutputStream.write(file.bytes)
            fileOutputStream.close()
        } catch (exc: IOException) {
            return false
        }
        return true
    }

    /**
     * stores the constraints parsed to JSON as a json file
     * @param fileType the name of the file
     * @param domainId id of the domain the file belongs to
     * @param constraints list of constraints, may be null
     */
    @Throws(FileNotFoundException::class)
    override fun storeConstraint(domainId: ObjectId, fileType: FileTypes, constraints: List<Constraint>?): Boolean {
        // Main JSON body
        val totalFile = JSONObject()
        // Array with all provided constraints
        val constraintsArray = JSONArray()
        // For every constraint provided add it to the array of constraints
        constraints?.forEach { constraint ->
            constraintsArray.put(constraint.toJSONObject())
        }
        totalFile.put("constraints", constraintsArray)

        val fileOutputStream = fileService.createFile(domainId, fileType)
        fileOutputStream.write(totalFile.toString().toByteArray())
        fileOutputStream.close()
        return true
    }

    /**
     * retrieves the file as a FileSystemResource response
     * @param domainId the id of the domain
     * @param fileType the type of the file
     * @return the file as a FileSystemResource
     */
    override fun loadFileAsResponse(domainId: ObjectId, fileType: FileTypes, user: User?): ResponseEntity<Resource> {
        hasAccessToDomain(domainId, user)

        val file = fileService.loadFile(domainId, fileType)
        val resource = FileSystemResource(file)
        return resourceAsResponseEntity(resource, fileType.type)
    }

    /**
     * retrieves the file as a zip response
     * @param domainId the id of the domain
     * @param fileTypes the list of types of the file
     * @return the file as a FileSystemResource
     */
    override fun loadFilesAsZippedResponse(domainId: ObjectId, fileTypes: List<FileTypes>, user: User?, zipName: String): ResponseEntity<Resource> {
        hasAccessToDomain(domainId, user)

        val resourceMap = mutableMapOf<String, ByteArray>()
        fileTypes.forEach { type ->
            val file = fileService.loadFile(domainId, type)
            val fileInputStream = FileInputStream(file)
            resourceMap[file.name] = fileInputStream.readAllBytes()
        }

        return resourcesToZip(resourceMap, zipName)
    }

    /**
     * Converts a list of requested solutions to the requested format
     * @param solutions the list of requested solutions
     * @param solutionConverter a function that converts the solution requested to the appropriate type
     * @param fileType the type of the file i.e. png/sh/cwl
     * @param fileName the name of the file
     * @return the converted solutions wrapped in a response entity
     */
    override fun indexToResponseEntity(solutions: List<Int>, solutionConverter: (Int) -> ByteArray, fileType: String, fileName: String): ResponseEntity<Resource> {
        return if (solutions.size > 1) {
            val resourceMap = mutableMapOf<String, ByteArray>()
            solutions.forEach { id ->
                resourceMap["workflow$id.$fileType"] = solutionConverter(id)
            }
            resourcesToZip(resourceMap, fileName)
        } else {
            val outcome = solutionConverter(solutions[0])
            resourceAsResponseEntity(ByteArrayResource(outcome), "$fileName.$fileType")
        }
    }

    /**
     * converts multiple byteArrays to a single zip file and returns it as a response
     * @param resources a map containing the file name as key, and a byteArray as value
     * @param zipName the name of the zip
     * @return a zip as ResponseEntity
     */
    override fun resourcesToZip(resources: Map<String, ByteArray>, zipName: String): ResponseEntity<Resource> {
        val outputStream = ByteArrayOutputStream()
        val bufferedOutputStream = BufferedOutputStream(outputStream)
        val zipOutputStream = ZipOutputStream(bufferedOutputStream)

        resources.forEach { resource ->
            zipOutputStream.putNextEntry(ZipEntry(resource.key))
            zipOutputStream.write(resource.value)
            zipOutputStream.closeEntry()
        }

        zipOutputStream.close()
        bufferedOutputStream.close()
        outputStream.close()

        val zippedResource = ByteArrayResource(outputStream.toByteArray())

        return resourceAsResponseEntity(zippedResource, "$zipName.zip")
    }

    /**
     * returns the resource wrapped in a response entity
     * @param resource the resource to be sent
     * @param fileName the name of the file
     * @return a resource wrapped in a ResponseEntity
     */
    override fun resourceAsResponseEntity(resource: Resource, fileName: String): ResponseEntity<Resource> {
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=\"$fileName\"")
            .contentLength(resource.contentLength())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)
    }
}
