/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.filesystem

import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.persistence.database.entity.User
import org.bson.types.ObjectId
import org.springframework.core.io.Resource
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile

interface StorageService {
    fun initDomainDirectories(domainId: ObjectId): Boolean
    fun deleteDomainDirectories(domainId: ObjectId): Boolean
    fun hasAccessToDomain(domainId: ObjectId, user: User?)
    fun storeDomainFile(domainId: ObjectId, file: MultipartFile, fileType: FileTypes): Boolean
    fun storeConstraint(domainId: ObjectId, fileType: FileTypes, constraints: List<Constraint>?): Boolean
    fun loadFileAsResponse(domainId: ObjectId, fileType: FileTypes, user: User?): ResponseEntity<Resource>
    fun loadFilesAsZippedResponse(domainId: ObjectId, fileTypes: List<FileTypes>, user: User?, zipName: String): ResponseEntity<Resource>
    fun indexToResponseEntity(solutions: List<Int>, solutionConverter: (Int) -> ByteArray, fileType: String, fileName: String): ResponseEntity<Resource>
    fun resourceAsResponseEntity(resource: Resource, fileName: String): ResponseEntity<Resource>
    fun resourcesToZip(resources: Map<String, ByteArray>, zipName: String): ResponseEntity<Resource>
}
