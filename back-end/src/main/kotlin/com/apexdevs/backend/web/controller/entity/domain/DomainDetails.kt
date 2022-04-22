/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.persistence.database.entity.DomainVisibility

/**
 * Used to send more detailed domain information of a specific domain to FE.
 *
 * @param id the unique id of the domain
 * @param title name of the domain
 * @param topics list of the topics the domain belongs to
 * @param description the description of the domain
 * @param visibility The visibility level of the domain.
 * @param topics The topics related to the domain.
 * @param ontologyPrefixIRI The ontology prefix IRI.
 * @param toolsTaxonomyRoot The tools' taxonomy root.
 * @param dataDimensionsTaxonomyRoots The data dimensions' root.
 * @param strictToolAnnotations Whether the domain uses strict tool annotations.
 */
data class DomainDetails(
    val id: String,
    val title: String,
    val description: String,
    val visibility: DomainVisibility,
    val topics: List<String>,
    val ontologyPrefixIRI: String,
    val toolsTaxonomyRoot: String,
    val dataDimensionsTaxonomyRoots: List<String>,
    val strictToolAnnotations: Boolean
)
