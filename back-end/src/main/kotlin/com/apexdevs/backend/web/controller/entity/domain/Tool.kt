/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.ape.entity.workflow.Data

/**
 * Class to parse incoming JSON from the front-end
 * into a class that is easier to handle in the back-end
 * an operation is made out of multiple input data ("image","Fonts",etc.)
 * and has a single output
 * @param name name of the tool
 * @param input list of Data that will be parsed to ape
 * @param output list of Data that will be parsed to ape
 */
data class Tool(
    val name: String,
    val input: MutableList<Data?>?,
    val output: MutableList<Data?>?
)
