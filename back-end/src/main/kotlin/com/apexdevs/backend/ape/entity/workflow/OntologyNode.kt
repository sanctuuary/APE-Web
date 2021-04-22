/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

/**
 * class that represents an entry in the ontology tree
 * it can have multiple children as new OntologyNodes
 * @param label: pretty printed name of the node
 * @param id: name of the node as provided in APE
 * @param children: list of child OntologyNodes default null
 */
data class OntologyNode(val label: String, val id: String, val children: MutableList<OntologyNode>? = null)
