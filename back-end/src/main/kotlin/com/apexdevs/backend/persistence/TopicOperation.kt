/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainTopic
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.repository.DomainTopicRepository
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import com.apexdevs.backend.persistence.exception.TopicNotFoundException
import org.bson.types.ObjectId
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Component

/**
 * Performs topic operations on the database
 * @param domainTopicRepository (autowired)
 * @param topicRepository (autowired)
 */
@Component
class TopicOperation(val topicRepository: TopicRepository, val domainTopicRepository: DomainTopicRepository) {
    @Throws(DuplicateKeyException::class)
    fun createTopic(topic: Topic) {
        try {
            topicRepository.insert(topic)
        } catch (exception: DuplicateKeyException) {
            throw DuplicateKeyException("This topic already exists")
        }
    }

    @Throws(DuplicateKeyException::class)
    fun renameTopic(topic: Topic, name: String) {
        try {
            topic.name = name
            topicRepository.save(topic)
        } catch (exception: DuplicateKeyException) {
            throw DuplicateKeyException("This topic already exists")
        }
    }

    @Throws(TopicNotFoundException::class)
    fun assignToDomain(topic: ObjectId, domain: Domain) {
        val topicToConnect = topicRepository.findById(topic)
        if (topicToConnect.isEmpty) {
            throw TopicNotFoundException(topic, "Topic with id: $topic not found!")
        }
        domainTopicRepository.insert(DomainTopic(domain.id, topicToConnect.get().id))
    }

    fun unAssignFromDomain(topic: ObjectId, domain: Domain) {
        domainTopicRepository.findByDomainId(domain.id)
            .filter { domainTopic: DomainTopic -> domainTopic.topicId == topic }
            .map { domainTopic: DomainTopic -> domainTopicRepository.deleteById(domainTopic.id) }
    }

    /**
     * Replaces current topics with new topics
     * @param domain the domain of which topics need to be updated
     * @param newTopics list of ObjectId's of the topics you want to update the domain with
     */
    fun updateDomainTopics(domain: Domain, newTopics: List<ObjectId>?) {
        newTopics?.let {
            val currentTopics = domainTopicRepository.findByDomainId(domain.id)
            for (c in currentTopics)
                unAssignFromDomain(c.topicId, domain)

            for (n in newTopics)
                assignToDomain(n, domain)
        }
    }
}
