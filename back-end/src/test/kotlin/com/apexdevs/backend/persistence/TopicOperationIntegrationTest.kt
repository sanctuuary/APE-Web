/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.DatabaseTestConfig
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.DomainTopicRepository
import io.mockk.spyk
import org.bson.types.ObjectId
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.fail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@DataMongoTest
@ContextConfiguration(classes = [DatabaseTestConfig::class, DomainOperation::class, TopicOperation::class, DomainTopicRepository::class])
@DisplayName("Database TopicOperation tests")
class TopicOperationIntegrationTest(
    @Autowired val domainOperation: DomainOperation,
    @Autowired val topicOperation: TopicOperation,
    @Autowired val domainTopicRepository: DomainTopicRepository
) {
    private fun provideTestUser(): User {
        val userId: ObjectId = ObjectId.get()
        val user = User(userId, "$userId@test.com", "123", "test", UserStatus.Approved)
        domainOperation.userRepository.insert(user)

        return user
    }

    private fun provideTestDomain(ownerId: ObjectId): Domain {
        val domain = spyk(
            Domain(
                "MyTestDomain",
                "My test domain description",
                DomainVisibility.Private,
                "Test",
                "Test",
                listOf("Test"),
                true
            )
        )
        domainOperation.createDomain(domain, ownerId)

        return domain
    }

    private fun provideTestTopic(): Topic {
        val topic = Topic("Test")
        topicOperation.createTopic(topic)

        return topic
    }

    @Test
    fun `Topic create operation test`() {
        val testTopic = provideTestTopic()
        val topicResult = topicOperation.topicRepository.findById(testTopic.id)

        if (topicResult.isEmpty)
            fail("Topic is not created")
    }

    @Test
    fun `Topic rename operation test`() {
        val testTopic = provideTestTopic()
        var topicResult = topicOperation.topicRepository.findById(testTopic.id)

        if (topicResult.isEmpty)
            fail("Topic is not created")

        val newName = "NewName"
        val topic = topicResult.get()

        topicOperation.renameTopic(topicResult.get(), newName)
        topicResult = topicOperation.topicRepository.findById(topic.id)

        if (topicResult.isEmpty)
            fail("Topic is not renamed")
    }

    @Test
    fun `Topic domain assigning operation test`() {
        val testTopic = provideTestTopic()
        val testDomain = provideTestDomain(provideTestUser().id)

        topicOperation.assignToDomain(testTopic.id, testDomain)

        val domainTopicResult = domainTopicRepository.findByDomainId(testDomain.id)

        if (domainTopicResult.isEmpty())
            fail("Topic Domain reference not created")

        val domainTopic = domainTopicResult[0]

        assert(domainTopic.domainId == testDomain.id)
        assert(domainTopic.topicId == testTopic.id)
    }

    @Test
    fun `Topic domain unassigning operation test`() {
        val testTopic = provideTestTopic()
        val testDomain = provideTestDomain(provideTestUser().id)

        topicOperation.assignToDomain(testTopic.id, testDomain)
        topicOperation.unAssignFromDomain(testTopic.id, testDomain)

        val domainTopic = domainTopicRepository.findByDomainId(testDomain.id)

        if (domainTopic.isNotEmpty())
            fail("Topic Domain reference not deleted")
    }

    @Test
    fun `Domain-Topic pairs are properly updated`() {
        // prepare start scenario
        val domain = provideTestDomain(provideTestUser().id)
        topicOperation.assignToDomain(provideTestTopic().id, domain)
        topicOperation.assignToDomain(provideTestTopic().id, domain)

        // wanted changes
        val newTopics = listOf(provideTestTopic().id)

        topicOperation.updateDomainTopics(domain, newTopics)

        val updatedTopics = domainTopicRepository.findByDomainId(domain.id).map { it.topicId }

        assert(updatedTopics == newTopics)
    }
}
