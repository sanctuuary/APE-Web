/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.ape.entity.workflow.Data
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class ToolTest {

    private val data = mutableListOf<Data?>(Data(mutableMapOf()))
    private val name = "Test"
    private val tool = Tool(name, data, data)
    @Test
    fun getName() {
        assertEquals(name, tool.name)
    }

    @Test
    fun getInput() {
        assertEquals(data, tool.input)
    }

    @Test
    fun getOutput() {
        assertEquals(data, tool.output)
    }
}
