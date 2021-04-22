/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainTopic
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.repository.DomainTopicRepository
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import com.apexdevs.backend.persistence.exception.TopicNotFoundException
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.spyk
import org.bson.types.ObjectId
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.dao.DuplicateKeyException
import java.util.Optional

@DisplayName("Database TopicOperation tests")
class TopicOperationTest {
    /**
     * Method: createTopic
     */
    @Test
    fun `Assert create topic insert correct value`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // set mocking returns and captures
        val topicSlot = slot<Topic>()

        every { topicRepository.insert(capture(topicSlot)) } answers
            { topicSlot.captured }

        // perform method
        val topic = Topic(ObjectId.get(), "topicTest")
        topicOperation.createTopic(topic)

        // check results
        assert(topicSlot.isCaptured)
        assert(topicSlot.captured == topic)
    }

    /**
     * Method: createTopic
     */
    @Test
    fun `Assert create topic throws if already exists`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // set mocking returns
        every { topicRepository.insert(any<Topic>()) } throws
            DuplicateKeyException("Topic already exists")

        // perform method and check exception
        val topic = Topic(ObjectId.get(), "topicTest")

        assertThrows<DuplicateKeyException> {
            topicOperation.createTopic(topic)
        }
    }

    /**
     * Method: renameTopic
     */
    @Test
    fun `Assert rename topic edits value`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // set mocking returns and captures
        val topicSlot = slot<Topic>()

        every { topicRepository.save(capture(topicSlot)) } answers
            { topicSlot.captured }

        // perform method
        val topic = Topic(ObjectId.get(), "topicTest")
        val newName = "topicTestNew"
        topicOperation.renameTopic(topic, newName)

        // check results
        assert(topicSlot.isCaptured)
        val newTopic = topicSlot.captured
        assert(newTopic.id == topic.id)
        assert(newTopic.name == newName)
    }

    /**
     * Method: renameTopic
     */
    @Test
    fun `Assert rename topic throws if already exists`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // set mocking returns
        every { topicRepository.save(any<Topic>()) } throws
            DuplicateKeyException("Topic already exists")

        // perform method and check exception
        val topic = Topic(ObjectId.get(), "topicTest")

        assertThrows<DuplicateKeyException> {
            topicOperation.renameTopic(topic, "topicTestNew")
        }
    }

    /**
     * Method: assignToDomain
     */
    @Test
    fun `Assert assign to domain inserts correct value`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // make test data
        val topic = Topic(ObjectId.get(), "topicTest")
        val domain = getTestDomain()

        // set mocking returns and captures
        val topicIdSlot = slot<ObjectId>()
        val domainTopicSlot = slot<DomainTopic>()

        every { topicRepository.findById(capture(topicIdSlot)) } answers
            { Optional.of(topic) }

        every { domainTopicRepository.insert(capture(domainTopicSlot)) } answers
            { domainTopicSlot.captured }

        // perform method
        topicOperation.assignToDomain(topic.id, domain)

        // check results
        assert(topicIdSlot.isCaptured)
        assert(topicIdSlot.captured == topic.id)
        assert(domainTopicSlot.isCaptured)
        val domainTopic = domainTopicSlot.captured
        assert(domainTopic.topicId == topic.id)
        assert(domainTopic.domainId == domain.id)
    }

    /**
     * Method: assignToDomain
     */
    @Test
    fun `Assert assign to domain throws if topic not found`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // make test data
        val domain = getTestDomain()

        // set mocking returns
        every { topicRepository.findById(any()) } returns
            Optional.empty<Topic>()

        // perform method and check exception
        assertThrows<TopicNotFoundException> {
            topicOperation.assignToDomain(ObjectId.get(), domain)
        }
    }

    /**
     * Method: unAssignToDomain
     */
    @Test
    fun `Assert unAssign to domain removes correct value`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // make test data
        val topic = Topic(ObjectId.get(), "topicTest")
        val domain = getTestDomain()
        val domainTopic = DomainTopic(domain.id, topic.id)
        val topic2 = Topic(ObjectId.get(), "topicTest2")
        val domain2 = getTestDomain()
        val domainTopic2 = DomainTopic(domain2.id, topic2.id)

        // set mocking returns and captures
        val domainTopicIdSlot = slot<ObjectId>()
        val domainSlot = slot<ObjectId>()

        every { domainTopicRepository.findByDomainId(capture(domainSlot)) } answers
            { listOf(domainTopic, domainTopic2) }

        every { domainTopicRepository.deleteById(capture(domainTopicIdSlot)) } answers
            {}

        // perform method
        topicOperation.unAssignFromDomain(topic.id, domain)

        // check results
        assert(domainSlot.isCaptured)
        assert(domainSlot.captured == domain.id)
        assert(domainTopicIdSlot.isCaptured)
        assert(domainTopicIdSlot.captured == domainTopic.id)
    }

    /**
     * Method: updateDomainTopics
     */
    @Test
    fun `Assert update domain topics unAssigns and assigns correctly`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = spyk(TopicOperation(topicRepository, domainTopicRepository))

        // make test data
        val domain = getTestDomain()
        val domainTopics = List(5) { i -> DomainTopic(domain.id, Topic(ObjectId.get(), "topicTest$i").id) }
        val newTopicIds = List(5) { ObjectId.get() }

        // set mocking returns and captures
        val findDomainSlot = slot<ObjectId>()

        val unAssignDomainSlot = mutableListOf<Domain>()
        val unAssignTopicIdSlot = mutableListOf<ObjectId>()

        val assignDomainSlot = mutableListOf<Domain>()
        val assignTopicIdSlot = mutableListOf<ObjectId>()

        every { domainTopicRepository.findByDomainId(capture(findDomainSlot)) } answers
            { domainTopics }

        every { topicOperation.unAssignFromDomain(capture(unAssignTopicIdSlot), capture(unAssignDomainSlot)) } answers
            {}

        every { topicOperation.assignToDomain(capture(assignTopicIdSlot), capture(assignDomainSlot)) } answers
            {}

        // perform method
        topicOperation.updateDomainTopics(domain, newTopicIds)

        // check results
        assert(findDomainSlot.isCaptured)
        assert(findDomainSlot.captured == domain.id)

        // make sure exactly those topics get unassigned that were assigned to the domain
        assert(
            unAssignTopicIdSlot.isNotEmpty() &&
                unAssignTopicIdSlot.containsAll(domainTopics.map { dt -> dt.topicId }) &&
                unAssignTopicIdSlot.size == domainTopics.size
        )

        // make sure all domains for unAssign were correctly entered
        assert(unAssignDomainSlot.all { d -> d == domain })

        // make sure exactly those topics get assigned that were in the new topic list
        assert(
            assignTopicIdSlot.isNotEmpty() &&
                assignTopicIdSlot.containsAll(newTopicIds) &&
                assignTopicIdSlot.size == newTopicIds.size
        )

        // make sure all domains for assign were correctly entered
        assert(assignDomainSlot.all { d -> d == domain })
    }

    /**
     * Method: updateDomainTopics
     */
    @Test
    fun `Assert update domain topics exits if topics is null`() {
        // create mocks
        val topicRepository = mockk<TopicRepository>()
        val domainTopicRepository = mockk<DomainTopicRepository>()

        // create instance with mocks
        val topicOperation = TopicOperation(topicRepository, domainTopicRepository)

        // run method with null topics
        val domain = getTestDomain()
        topicOperation.updateDomainTopics(domain, null)

        // nothing to assert, method should exit cleanly
    }

    /**
     * Create test domain with default values
     */
    private fun getTestDomain(visibility: DomainVisibility = DomainVisibility.Public): Domain {
        return Domain(
            "domainTest",
            "descriptionTest",
            visibility,
            "ontologyTest",
            "taxonomyTest",
            listOf("dataTest"),
            false
        )
    }
}
