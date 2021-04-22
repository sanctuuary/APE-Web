/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

/**
 * Class to parse incoming JSON from the front-end
 * into a class that is easier to handle in the back-end
 * @param input list of Data that will be parsed to ape
 * @param expectedOutput list of Data that ape is expected to give
 * @param constraints optional list of constraints
 * @param maxDuration maxDuration of APE to run
 * @param solutions maximum amount of solutions APE needs to generate
 * @param maxLength maximum length of a solution
 * @param minLength minimum length of a solution
 */
data class InputData(
    val input: List<Data>,
    val expectedOutput: List<Data>,
    val constraints: List<Constraint>? = null,
    val maxDuration: Int,
    val solutions: Int,
    val maxLength: Int,
    val minLength: Int
)
