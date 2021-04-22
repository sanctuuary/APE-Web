/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.collection

import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import org.springframework.stereotype.Component

/**
 * TopicCollection class, to retrieve collections of topics from the database
 * @param topicRepository: Required for getting lists of topics.
 */
@Component
class TopicCollection(val topicRepository: TopicRepository) {

    /**
     * Returns all topics from MongoDB
     * @return List<TopicInfo>: All topics stored in MongoDB, safe for transfer
     */
    fun getAllTopics(): List<Topic> {
        return topicRepository.findAll()
    }
}
