/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Domain visibility (ordinal)
 * @constructor options: Archived, Private, Public
 */
enum class DomainVisibility { Archived, Private, Public }

/**
 * Domain document for storing in the database
 *
 * @param id unique identifier
 * @param name domain name (not unique)
 * @param description written information about the domain
 * @param localPath local filesystem path where domain data is stored
 * @param visibility sets domain visibility for other users
 * @param ontologyPrefixIRI the prefixIRI the OWL file needs to read the file
 * @param toolsTaxonomyRoot the root of the tools annotations file
 * @param dataDimensionsTaxonomyRoots a list of data dimensions
 * @param strictToolsAnnotations indicator of whether the tools annotations are strict
 */
@Document
data class Domain(
    @Id val id: ObjectId,
    var name: String,
    var description: String,
    var localPath: String,
    var visibility: DomainVisibility,
    var ontologyPrefixIRI: String,
    var toolsTaxonomyRoot: String,
    var dataDimensionsTaxonomyRoots: List<String>,
    var strictToolsAnnotations: Boolean
) {
    companion object {
        // Uninitialized domain path, used for filling in id related domain path
        const val mockLocalPath: String = "domain/_empty/"
    }

    /**
     * Domain constructor without static id
     */
    constructor(name: String, description: String, localPath: String, visibility: DomainVisibility, ontologyPrefixIRI: String, toolsTaxonomyRoot: String, dataDimensionsTaxonomyRoots: List<String>, strictToolsAnnotations: Boolean) :
        this(ObjectId.get(), name, description, localPath, visibility, ontologyPrefixIRI, toolsTaxonomyRoot, dataDimensionsTaxonomyRoots, strictToolsAnnotations)

    /**
     * Domain constructor without static id or path
     */
    constructor(name: String, description: String, visibility: DomainVisibility, ontologyPrefixIRI: String, toolsTaxonomyRoot: String, dataDimensionsTaxonomyRoots: List<String>, strictToolsAnnotations: Boolean) :
        this(name, description, mockLocalPath, visibility, ontologyPrefixIRI, toolsTaxonomyRoot, dataDimensionsTaxonomyRoots, strictToolsAnnotations)

    init {
        // Fill in id related domain path if path is mock
        if (localPath == mockLocalPath)
            localPath = "domain/$id/"
    }
}
