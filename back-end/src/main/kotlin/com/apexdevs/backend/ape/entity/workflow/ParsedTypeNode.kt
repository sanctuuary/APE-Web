/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

/**
 * Data class that represents the type-nodes in a front-end friendly manner
 * @param id the internal id as represented in APE
 * @param label a front-end friendly label
 */
data class ParsedTypeNode(val id: String, val label: String)
