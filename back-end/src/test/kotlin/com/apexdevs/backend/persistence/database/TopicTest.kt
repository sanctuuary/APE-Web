/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database

import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@DataMongoTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Database Topic tests")
class TopicTest(@Autowired val topicRepository: TopicRepository) {
    private val topicList = List<ObjectId>(10) { ObjectId.get() }

    @BeforeAll
    fun `Topic insertion test`() {
        for ((n, topicId) in topicList.withIndex()) {
            // Insert new topic with an Id from the topicList
            topicRepository.insert(Topic(topicId, "TestTopic $n"))
        }
    }

    @Test
    fun `Topic search test`() {
        val results = topicRepository.findAllById(topicList)

        // Assert that exactly the same amount of topics were inserted and found as intended
        Assertions.assertEquals(topicList.count(), results.count())
    }

    @Test
    fun `Topic collection listing test`() {
        // Assert that a group query
        Assertions.assertTrue(topicRepository.count() >= topicList.count())
    }
}
