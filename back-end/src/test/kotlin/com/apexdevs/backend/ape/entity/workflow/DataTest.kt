/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.json.JSONObject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class DataTest {

    @Test
    fun toJSONObject() {
        val testJson = JSONObject()
        testJson.accumulate("type", "Test")
        testJson.accumulate("format", "Test")
        val mutableMap = mutableMapOf<String, String>()
        mutableMap["type"] = "Test"
        mutableMap["format"] = "Test"
        val data = Data(mutableMap).toJSONObject()
        assertEquals(testJson.toString(), data.toString())
    }
}
