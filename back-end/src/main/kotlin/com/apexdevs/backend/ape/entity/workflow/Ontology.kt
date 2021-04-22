/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

/**
 * Class that defines all the different kind of data
 * @param roots list of starting OntologyNodes
 */
data class Ontology(val roots: MutableList<OntologyNode>)
