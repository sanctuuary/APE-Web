/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.database.collection.TopicCollection
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.web.controller.entity.topic.TopicInfo
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

/**
 * Class for handling the regular calls coming from the front-end
 * All regular data calls for topics should be made through here
 */
@RestController
@RequestMapping("/topic")
class TopicController(private val topicCollection: TopicCollection) {
    /**
     * Returns all topics
     * @return list of safe topics
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun getAllTopics(): List<TopicInfo> {
        try {
            return topicCollection.getAllTopics().map { topic: Topic -> TopicInfo(topic.id.toHexString(), topic.name) }
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }
}
