/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class InputDataTest {

    private val map = mutableMapOf<String, String>()
    private val data = listOf(Data(map))
    private val test = "Test"
    private val constraints = listOf(Constraint("use_m", test, listOf("tool"), data))
    private val inputData = InputData(data, data, constraints, 1, 1, 1, 1)

    @Test
    fun getInput() {
        assertEquals(data, inputData.input)
    }

    @Test
    fun getExpectedOutput() {
        assertEquals(data, inputData.expectedOutput)
    }

    @Test
    fun getConstraint() {
        assertEquals(constraints, inputData.constraints)
    }

    @Test
    fun getMaxDuration() {
        assertEquals(1, inputData.maxDuration)
    }

    @Test
    fun getSolutions() {
        assertEquals(1, inputData.solutions)
    }

    @Test
    fun getMaxLength() {
        assertEquals(1, inputData.maxLength)
    }

    @Test
    fun getMinLength() {
        assertEquals(1, inputData.minLength)
    }
}
