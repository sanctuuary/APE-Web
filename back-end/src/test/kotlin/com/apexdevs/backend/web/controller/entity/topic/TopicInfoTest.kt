/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.topic

import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class TopicInfoTest {

    private val test = "Test"
    private val domainRequest = TopicInfo(ObjectId.get().toHexString(), test)

    @Test
    fun getName() {
        assertEquals(test, domainRequest.name)
    }
}
