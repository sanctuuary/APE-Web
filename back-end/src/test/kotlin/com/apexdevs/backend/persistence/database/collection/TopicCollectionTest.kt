/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.collection

import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

@DisplayName("Database TopicCollection tests")
class TopicCollectionTest {
    /**
     * Method: getAllTopics
     */
    @Test
    fun `Assert find all topics returns correctly`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()

        // create instance
        val topicCollection = TopicCollection(topicRepository)

        // make test data
        val testTopics = listOf(Topic("testTopic1"), Topic("testTopic2"))

        // set mock returns
        every { topicRepository.findAll() } returns
            testTopics

        // perform method
        val topicResult = topicCollection.getAllTopics()

        assert(topicResult.isNotEmpty())
        assert(topicResult.size == testTopics.size)
        assert(topicResult.distinct().containsAll(testTopics))
    }
}
