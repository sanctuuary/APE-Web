/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.database.collection.TopicCollection
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.web.controller.entity.topic.TopicInfo
import io.mockk.every
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TopicControllerTest {
    private val mockTopicCollection = mockk<TopicCollection>()
    private val mockTopicController = TopicController(mockTopicCollection)

    private val t = "test"
    private val id = ObjectId()
    private val topic = Topic(id, t)
    private val topicInfo = TopicInfo(topic.id.toHexString(), t)

    @BeforeAll
    fun init() {
        val topicList = listOf(topic)
        every { mockTopicCollection.getAllTopics() } returns topicList
    }

    @Test
    fun `Topics are retrieved correctly`() {
        val topics = listOf(topicInfo)
        assertEquals(topics, mockTopicController.getAllTopics())
    }
}
