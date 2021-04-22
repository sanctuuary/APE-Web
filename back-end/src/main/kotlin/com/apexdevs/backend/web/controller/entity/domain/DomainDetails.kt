/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.persistence.database.entity.DomainVisibility

/**
 * Used to send domain information to FE.
 */
data class DomainDetails(
    val id: String,
    val title: String,
    val description: String,
    val visibility: DomainVisibility,
    val topics: List<String>,
    val ontologyPrefixIRI: String,
    val toolsTaxonomyRoot: String,
    val dataDimensionsTaxonomyRoots: List<String>
)
