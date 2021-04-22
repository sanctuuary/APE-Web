/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class OntologyNodeTest {

    private val test = "Test"
    private var ontologyNode = OntologyNode(test, test, null)

    @Test
    fun getLabel() {
        assertEquals(ontologyNode.label, test)
    }

    @Test
    fun getId() {
        assertEquals(ontologyNode.id, test)
    }

    @Test
    fun getChildren() {
        assertEquals(ontologyNode.children, null)
        val ontologyNodeChild = OntologyNode(test, test, mutableListOf(ontologyNode))
        assertEquals(ontologyNodeChild.children, mutableListOf(ontologyNode))
    }
}
