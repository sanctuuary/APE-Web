/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import org.bson.types.ObjectId

/**
 * Class with all required fields for the domain
 * @param title name of the domain
 * @param description contains additional written information
 * @param topics classifiers of the domain for organizing
 * @param ontologyPrefix prefixIRI needed for the OWL file
 * @param toolsTaxonomyRoot root of the tools taxonomy
 * @param dataDimensionsTaxonomyRoots list of Strings with the data dimension roots of the ontology
 * @param visibility indicates if domain is publicly visible on website
 * @param strictToolsAnnotations indicator of whether the tools annotations are strict
 */
data class DomainUploadRequest(
    val title: String?,
    val description: String?,
    val topics: List<ObjectId>?,
    val ontologyPrefix: String?,
    val toolsTaxonomyRoot: String?,
    val dataDimensionsTaxonomyRoots: List<String>?,
    val visibility: DomainVisibility?,
    val strictToolsAnnotations: Boolean?
)
