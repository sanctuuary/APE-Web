/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.filesystem

import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.util.FileSystemUtils
import java.io.File
import java.io.FileNotFoundException
import java.io.FileOutputStream
import java.io.IOException
import java.nio.file.FileSystemException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import javax.annotation.PostConstruct

/**
 * Class that handles File I/O
 */
@Service
class FileService @Autowired constructor(properties: StorageProperties) {

    val rootLocation: Path = Paths.get(properties.location)

    /**
     * If the directories do not exist yet they are created
     */
    @PostConstruct
    fun init() {
        try {
            Files.createDirectories(rootLocation)
        } catch (e: IOException) {
            throw StorageException("Could not initialize storage location", e)
        }
    }

    /**
     * Creates/Opens the directory for the given domain
     * A file is created/opened with the given name and the outputStream is wrapped in a FileOutputStream
     * @param domainId id of the domain
     * @param fileType type of the file
     * @return printWriter
     */
    fun createFile(domainId: ObjectId, fileType: FileTypes): FileOutputStream {
        try {
            val filename = "$domainId/${fileType.type}"
            val newFile = File(rootLocation.resolve(filename).toString())
            newFile.createNewFile()
            newFile.setWritable(true)
            return newFile.outputStream()
        } catch (exc: FileSystemException) {
            throw StorageException("Failed to store file")
        }
    }

    /**
     * loads a file from the file system
     * @param fileType the name of the file
     * @param domainId id of the domain the file belongs to
     * @return the file handle
     */
    fun loadFile(domainId: ObjectId, fileType: FileTypes): File {
        try {
            return File(rootLocation.resolve("$domainId/${fileType.type}").toString())
        } catch (exc: FileNotFoundException) {
            throw StorageException("File not found")
        }
    }

    /**
     * Deletes all files located in the defined root location
     */
    fun deleteAll(domainId: ObjectId): Boolean {
        return FileSystemUtils.deleteRecursively(rootLocation.resolve(domainId.toHexString()).toFile())
    }
}
