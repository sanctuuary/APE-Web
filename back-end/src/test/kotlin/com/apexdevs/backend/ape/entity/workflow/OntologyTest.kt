/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class OntologyTest {

    private val ontologyNode = OntologyNode("Test", "Test", null)
    private val ontology = Ontology(mutableListOf(ontologyNode))

    @Test
    fun getRoots() {
        assertEquals(ontology.roots, mutableListOf(ontologyNode))
    }
}
