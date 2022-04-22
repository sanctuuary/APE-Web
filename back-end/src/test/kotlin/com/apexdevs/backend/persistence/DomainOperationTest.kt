/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainTopic
import com.apexdevs.backend.persistence.database.entity.DomainVerification
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.Topic
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.DomainRepository
import com.apexdevs.backend.persistence.database.repository.DomainTopicRepository
import com.apexdevs.backend.persistence.database.repository.DomainVerificationRepository
import com.apexdevs.backend.persistence.database.repository.TopicRepository
import com.apexdevs.backend.persistence.database.repository.UserDomainAccessRepository
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.UserAccessException
import com.apexdevs.backend.persistence.exception.UserDomainAccessNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.domain.DomainDetails
import com.apexdevs.backend.web.controller.entity.domain.DomainUploadRequest
import io.mockk.CapturingSlot
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.spyk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.Optional

@DisplayName("Database DomainOperation tests")
class DomainOperationTest() {
    // create mocking objects
    private val domainRepository = mockk<DomainRepository>()
    private val userRepository = mockk<UserRepository>()
    private val userDomainAccessRepository = mockk<UserDomainAccessRepository>()
    private val domainTopicRepository = mockk<DomainTopicRepository>()
    private val topicRepository = mockk<TopicRepository>()
    private val domainVerificationRepository = mockk<DomainVerificationRepository>()

    private fun getDomainOperation() = DomainOperation(
        domainRepository,
        userRepository,
        userDomainAccessRepository,
        domainTopicRepository,
        topicRepository,
        domainVerificationRepository
    )

    /**
     * Method: getDomainDetails
     */
    @Test
    fun `Assert DomainDetails are returned correctly`() {
        // prepare test data
        val domain = spyk(getTestDomain())
        every { domain.id.toHexString() } returns "testId"

        val spyDomainOperation = spyk(getDomainOperation())

        // set mock returns
        every { spyDomainOperation.getTopics(any()) } answers { listOf(Topic(ObjectId(), "test1")) }

        // create expected output
        val expected = DomainDetails(
            domain.id.toHexString(),
            domain.name,
            domain.description,
            domain.visibility,
            listOf("test1"),
            domain.ontologyPrefixIRI,
            domain.toolsTaxonomyRoot,
            domain.dataDimensionsTaxonomyRoots,
            domain.strictToolsAnnotations
        )

        // check result with expectation
        assert(spyDomainOperation.getDomainDetails(domain) == expected)
    }

    /**
     * Method: getTopics
     */
    @Test
    fun `Assert get topics return correct format`() {
        // create domain
        val domain = getTestDomain()
        val topic1 = Topic(ObjectId.get(), "testTopic1")
        val topic2 = Topic(ObjectId.get(), "testTopic2")

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { domainTopicRepository.findByDomainId(any()) } returns
            listOf(DomainTopic(domain.id, topic1.id), DomainTopic(domain.id, topic2.id))

        every { topicRepository.findAllById(any()) } returns
            listOf(topic1, topic2)

        // run method
        val topics = domainOperation.getTopics(domain)

        // check return value
        assert(topics.size == 2)
        assert(topics.containsAll(listOf(topic1, topic2)))
    }

    /**
     * Method: getDomain
     */
    @Test
    fun `Assert get domain returns correct domain`() {
        // create domain
        val domain = getTestDomain()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock results
        every { domainRepository.findById(any()) } returns
            Optional.of(domain)

        // perform method
        val domainResult = domainOperation.getDomain(domain.id)

        // compare result
        assert(domainResult == domain)
    }

    /**
     * Method: getDomain
     */
    @Test
    fun `Assert get domain throws if not found`() {
        // create domain
        val domain = getTestDomain()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock results
        every { domainRepository.findById(any()) } returns
            Optional.empty()

        // check if exception is thrown
        assertThrows<DomainNotFoundException> {
            domainOperation.getDomain(domain.id)
        }
    }

    /**
     * Method: createDomain
     */
    @Test
    fun `Assert create domain inserts correct data`() {
        // create domain
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // mock returns
        every { userRepository.findById(any()) } returns
            Optional.of(user)

        // capture insertions
        val domainSlot = slot<Domain>()
        val accessSlot = slot<UserDomainAccess>()

        every { domainRepository.insert(capture(domainSlot)) } answers
            { domainSlot.captured }

        every { userDomainAccessRepository.insert(capture(accessSlot)) } answers
            { accessSlot.captured }

        // run method
        domainOperation.createDomain(domain, user.id)

        // check captures
        assert(domainSlot.isCaptured)
        assert(domainSlot.captured == domain)
        assert(accessSlot.isCaptured)
        val accessCapture = accessSlot.captured
        assert(accessCapture.userId == user.id)
        assert(accessCapture.domainId == domain.id)
        assert(accessCapture.access == DomainAccess.Owner)
    }

    /**
     * Method: createDomain
     */
    @Test
    fun `Assert create domain throws if no user found`() {
        // create domain
        val domain = getTestDomain()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // mock returns
        every { userRepository.findById(any()) } returns
            Optional.empty()

        // check if exception is thrown
        assertThrows<UserNotFoundException> {
            domainOperation.createDomain(domain, ObjectId.get())
        }
    }

    /**
     * Method: getDomainAccess
     */
    @Test
    fun `Assert get domain access returns correct access`() {
        // create domain
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // mock returns
        every { userDomainAccessRepository.findByUserIdAndDomainId(any(), any()) } returns
            Optional.of(UserDomainAccess(user.id, domain.id, DomainAccess.Owner))

        // run method and check return
        val access = domainOperation.getDomainAccess(user, domain)
        assert(access == DomainAccess.Owner)
    }

    /**
     * Method: getDomainAccess
     */
    @Test
    fun `Assert get domain access throws if no access object is found`() {
        // instantiate object to test
        val domainOperation = getDomainOperation()

        // mock returns
        every { userDomainAccessRepository.findByUserIdAndDomainId(any(), any()) } returns
            Optional.empty()

        // check if exception is thrown
        assertThrows<UserDomainAccessNotFoundException> {
            domainOperation.getDomainAccess(getTestUser(), getTestDomain())
        }
    }

    /**
     * Method: saveDomain, isAuthorizedDomainUser
     */
    @Test
    fun `Assert save domain works for authorized users`() {
        // create domain, user and slot for domain
        val domain = getTestDomain()
        val user = getTestUser()

        val domainSlot = slot<Domain>()

        // perform save operation on domain with { Owner, ReadWrite }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            domainSlot,
            listOf(
                DomainAccess.Owner,
                DomainAccess.ReadWrite
            )
        ) { domainOperation: DomainOperation ->
            domainOperation.saveDomain(domain, user.id)
            assert(domainSlot.isCaptured)
            assert(domainSlot.captured == domain)
        }
    }

    /**
     * Method: saveDomain, isAuthorizedDomainUser
     */
    @Test
    fun `Assert save domain throws for unauthorized users`() {
        // create domain, user and slot for domain
        val domain = getTestDomain()
        val user = getTestUser()

        val domainSlot = slot<Domain>()

        // perform save operation on domain with { Read, Revoked }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            domainSlot,
            listOf(
                DomainAccess.Read,
                DomainAccess.Revoked
            )
        ) { domainOperation: DomainOperation ->
            assertThrows<UserAccessException> {
                domainOperation.saveDomain(domain, user.id)
            }
        }
    }

    /**
     * Method: archiveDomain, isAuthorizedDomainUser
     */
    @Test
    fun `Assert archive domain works for authorized users`() {
        // create domain, user and slot for domain
        val domain = getTestDomain()
        val user = getTestUser()

        val domainSlot = slot<Domain>()

        // perform archive operation on domain with { Owner }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            domainSlot,
            listOf(DomainAccess.Owner)
        ) { domainOperation: DomainOperation ->
            domainOperation.archiveDomain(domain, user.id)
            assert(domainSlot.isCaptured)
            assert(domainSlot.captured == domain.copy(visibility = DomainVisibility.Archived))
        }
    }

    /**
     * Method: archiveDomain, isAuthorizedDomainUser
     */
    @Test
    fun `Assert archive domain throws for unauthorized users`() {
        // create domain, user and slot for domain
        val domain = getTestDomain()
        val user = getTestUser()

        val domainSlot = slot<Domain>()

        // perform archive operation on domain with { ReadWrite, Read, Revoked }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            domainSlot,
            listOf(DomainAccess.ReadWrite, DomainAccess.Read, DomainAccess.Revoked)
        ) { domainOperation: DomainOperation ->
            assertThrows<UserAccessException> {
                domainOperation.archiveDomain(domain, user.id)
            }
        }
    }

    /**
     * Method: hasUserAccess
     */
    @Test
    fun `Assert has user access for public domains`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // check if public domain is read accessible
        assert(domainOperation.hasUserAccess(domain, DomainAccess.Read, user.id))
    }

    /**
     * Method: hasUserAccess, isAuthorizedDomainUser
     */
    @Test
    fun `Assert has user access for private read authorized domains`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user = getTestUser()

        // perform hasUserAccess operation on domain with { Owner, ReadWrite, Read }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            slot(),
            listOf(DomainAccess.Owner, DomainAccess.ReadWrite, DomainAccess.Read)
        ) {
            domainOperation ->
            assert(domainOperation.hasUserAccess(domain, DomainAccess.Read, user.id))
        }
    }

    /**
     * Method: hasUserAccess, isAuthorizedDomainUser
     */
    @Test
    fun `Assert has user access for private write authorized domains`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user = getTestUser()

        // perform hasUserAccess operation on domain with { Owner, ReadWrite, Read }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            slot(),
            listOf(DomainAccess.Owner, DomainAccess.ReadWrite)
        ) {
            domainOperation ->
            assert(domainOperation.hasUserAccess(domain, DomainAccess.ReadWrite, user.id))
        }
    }

    /**
     * Method: hasUserAccess, isAuthorizedDomainUser
     */
    @Test
    fun `Assert no user access for private read unauthorized domains`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user = getTestUser()

        // perform hasUserAccess operation on domain with { Read, Revoked }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            slot(),
            listOf(DomainAccess.Revoked)
        ) {
            domainOperation ->
            assert(!domainOperation.hasUserAccess(domain, DomainAccess.Read, user.id))
        }
    }

    /**
     * Method: hasUserAccess, isAuthorizedDomainUser
     */
    @Test
    fun `Assert no user access for private write unauthorized domains`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user = getTestUser()

        // perform hasUserAccess operation on domain with { Read, Revoked }
        performDomainUpdateForAuthorizedUser(
            domain,
            user,
            slot(),
            listOf(DomainAccess.Read, DomainAccess.Revoked)
        ) {
            domainOperation ->
            assert(!domainOperation.hasUserAccess(domain, DomainAccess.ReadWrite, user.id))
        }
    }

    /**
     * Method: hasUserAccess, isAuthorizedDomainUser
     */
    @Test
    fun `Assert is authorized domain user is false for invalid user`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { userRepository.findById(any()) } returns
            Optional.empty()

        // check if method returns false
        assert(!domainOperation.hasUserAccess(domain, DomainAccess.ReadWrite, user.id))
    }

    /**
     * Method: hasUserAccess, isAuthorizedDomainUser
     */
    @Test
    fun `Assert is authorized domain user is false for invalid user access`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { userRepository.findById(any()) } returns
            Optional.of(user)

        every { userDomainAccessRepository.findByUserIdAndDomainId(any(), any()) } returns
            Optional.empty()

        // check if method returns false
        assert(!domainOperation.hasUserAccess(domain, DomainAccess.ReadWrite, user.id))
    }

    /**
     * Method: hasAnonymousAccess
     */
    @Test
    fun `Assert anonymous access for domains that should`() {
        val publicDomain = getTestDomain(DomainVisibility.Public)
        val privateDomain = getTestDomain(DomainVisibility.Private)

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // can only access public domains for read access
        assert(domainOperation.hasAnonymousAccess(publicDomain, DomainAccess.Read))
        // nothing else
        assert(!domainOperation.hasAnonymousAccess(privateDomain, DomainAccess.Read))
        assert(!domainOperation.hasAnonymousAccess(privateDomain, DomainAccess.ReadWrite))
        assert(!domainOperation.hasAnonymousAccess(privateDomain, DomainAccess.Owner))
        assert(!domainOperation.hasAnonymousAccess(publicDomain, DomainAccess.ReadWrite))
        assert(!domainOperation.hasAnonymousAccess(publicDomain, DomainAccess.Owner))
    }

    /**
     * Method: setUserAccess
     */
    @Test
    fun `Assert set user access inserts new entry`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { userRepository.findById(any()) } returns
            Optional.of(user)

        every { userDomainAccessRepository.findByUserIdAndDomainId(any(), any()) } returns
            Optional.of(UserDomainAccess(user.id, domain.id, DomainAccess.Read))

        // capture access save
        val accessSlot = slot<UserDomainAccess>()
        every { userDomainAccessRepository.save(capture(accessSlot)) } answers
            { accessSlot.captured }

        // run method
        domainOperation.setUserAccess(domain, user.id, DomainAccess.ReadWrite)

        // check if access is set correctly
        assert(accessSlot.isCaptured)
        assert(accessSlot.captured.access == DomainAccess.ReadWrite)
    }

    /**
     * Method: setUserAccess
     */
    @Test
    fun `Assert set user access edits existing entry`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { userRepository.findById(any()) } returns
            Optional.of(user)

        every { userDomainAccessRepository.findByUserIdAndDomainId(any(), any()) } returns
            Optional.empty()

        // capture access save
        val accessSlot = slot<UserDomainAccess>()
        every { userDomainAccessRepository.insert(capture(accessSlot)) } answers
            { accessSlot.captured }

        // run method
        domainOperation.setUserAccess(domain, user.id, DomainAccess.Owner)

        // check if new entry contains correct data
        assert(accessSlot.isCaptured)
        val access = accessSlot.captured

        assert(access.domainId == domain.id)
        assert(access.userId == user.id)
        assert(access.access == DomainAccess.Owner)
    }

    /**
     * Method: setUserAccess
     */
    @Test
    fun `Assert set user access throws if invalid user`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { userRepository.findById(any()) } returns
            Optional.empty()

        // check if method throws exception
        assertThrows<UserNotFoundException> {
            domainOperation.setUserAccess(domain, user.id, DomainAccess.Owner)
        }
    }

    /**
     * Method: setUserAccess
     */
    @Test
    fun `Assert set user access works with domainId`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = spyk(getDomainOperation())

        // set mock returns and captures
        val domainSlot = slot<Domain>()

        every { domainOperation.setUserAccess(capture(domainSlot), any(), any()) } returns
            Unit

        every { domainRepository.findById(domain.id) } returns
            Optional.of(domain)

        // run method
        domainOperation.setUserAccess(domain.id, user.id, DomainAccess.Read)

        // check if method runs with correct parameters
        assert(domainSlot.isCaptured)
        assert(domainSlot.captured == domain)
    }

    /**
     * Method: setUserAccess
     */
    @Test
    fun `Assert set user access throws with invalid domainId`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = getDomainOperation()

        // set mock returns
        every { domainRepository.findById(any()) } returns
            Optional.empty()

        // check if exception is thrown
        assertThrows<DomainNotFoundException> {
            domainOperation.setUserAccess(domain.id, user.id, DomainAccess.Read)
        }
    }

    /**
     * Method: updateDomain
     */
    @Test
    fun `Assert update domain sets new values`() {
        // create domain and user
        val domain = getTestDomain()
        val user = getTestUser()

        // instantiate object to test
        val domainOperation = spyk(getDomainOperation())

        // mock call to save domain
        every { domainOperation.saveDomain(any(), any()) } returns
            Unit

        // update each segment once at a time
        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest("test1", null, null, null, null, null, null, null)
        )
        assert(domain.name == "test1")

        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, "test2", null, null, null, null, null, null)
        )
        assert(domain.description == "test2")

        val topic1 = ObjectId.get()
        val topic2 = ObjectId.get()
        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, null, listOf(topic1, topic2), null, null, null, null, null)
        )
        // ToDo: topics are not yet tested here, because they are not update with updateDomain

        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, null, null, "test4", null, null, null, null)
        )
        assert(domain.ontologyPrefixIRI == "test4")

        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, null, null, null, "test5", null, null, null)
        )
        assert(domain.toolsTaxonomyRoot == "test5")

        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, null, null, null, null, listOf("test6", "test7"), null, null)
        )
        assert(domain.dataDimensionsTaxonomyRoots == listOf("test6", "test7"))

        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, null, null, null, null, null, DomainVisibility.Private, null)
        )
        assert(domain.visibility == DomainVisibility.Private)

        domainOperation.updateDomain(
            domain,
            user.id,
            DomainUploadRequest(null, null, null, null, null, null, null, true)
        )
        assert(domain.strictToolsAnnotations)
    }

    @Test
    fun `Assert get users by domain and access works`() {
        // create domain and user
        val domain = getTestDomain(DomainVisibility.Private)
        val user1 = User("user1@test.test", "passTest", "user1", UserStatus.Approved)
        val user2 = User("user2@test.test", "passTest", "user2", UserStatus.Approved)

        val access1 = UserDomainAccess(user1.id, domain.id, DomainAccess.Owner)
        val access2 = UserDomainAccess(user2.id, domain.id, DomainAccess.ReadWrite)

        every { userDomainAccessRepository.findAllByDomainIdAndAccess(domain.id, DomainAccess.Owner) } returns
            listOf(access1)

        every { userDomainAccessRepository.findAllByDomainIdAndAccess(domain.id, DomainAccess.ReadWrite) } returns
            listOf(access2)

        val domainOperation = spyk(getDomainOperation())
        val result = domainOperation.getUsersByDomainAndAccess(domain.id, listOf(DomainAccess.Owner, DomainAccess.ReadWrite))
        assertEquals(2, result.size)
        assert(result.containsAll(listOf(access1, access2)))
    }

    @Test
    fun `Assert getVerification existing domain`() {
        val domain = getTestDomain()
        val verification = DomainVerification(domain.id, true, true)
        val domainOperation = getDomainOperation()

        every { domainRepository.findById(domain.id) } returns
            Optional.of(domain)

        every { domainVerificationRepository.findByDomainId(domain.id) } returns
            Optional.of(verification)

        val result = domainOperation.getVerification(domain.id)
        assertEquals(verification, result.get())
    }

    @Test
    fun `Assert getVerification domain does not exist`() {
        val domain = getTestDomain()
        val domainOperation = getDomainOperation()

        every { domainRepository.findById(domain.id) } returns
            Optional.empty()

        assertThrows<DomainNotFoundException> {
            domainOperation.getDomain(domain.id)
        }
    }

    @Test
    fun `Assert saveVerification new`() {
        val domainOperation = getDomainOperation()
        val domain = getTestDomain()
        val verification = DomainVerification(domain.id, true, true)

        every { domainRepository.findById(domain.id) } returns
            Optional.of(domain)

        every { domainVerificationRepository.findByDomainId(domain.id) } returns
            Optional.empty()

        val verificationSlot = slot<DomainVerification>()
        every { domainVerificationRepository.save(capture(verificationSlot)) } answers
            { verificationSlot.captured }

        domainOperation.saveVerification(verification)

        assert(verificationSlot.isCaptured)
        assertEquals(verification, verificationSlot.captured)
    }

    @Test
    fun `Assert saveVerification update`() {
        val domainOperation = getDomainOperation()
        val domain = getTestDomain()
        val verification = DomainVerification(domain.id, true, true)

        every { domainRepository.findById(domain.id) } returns
            Optional.of(domain)

        every { domainVerificationRepository.findByDomainId(domain.id) } returns
            Optional.of(verification)

        val verificationSlot = slot<DomainVerification>()
        every { domainVerificationRepository.save(capture(verificationSlot)) } answers
            { verificationSlot.captured }

        domainOperation.saveVerification(verification)

        assert(verificationSlot.isCaptured)
        assertEquals(verification, verificationSlot.captured)
    }

    @Test
    fun `Assert saveVerification domain does not exist`() {
        val domainOperation = getDomainOperation()
        val domain = getTestDomain()
        val verification = DomainVerification(domain.id, true, true)

        every { domainRepository.findById(domain.id) } returns
            Optional.empty()

        assertThrows<DomainNotFoundException> {
            domainOperation.saveVerification(verification)
        }
    }

    /**
     * Perform update with DomainRepository.save() with all options in authorization
     */
    private fun performDomainUpdateForAuthorizedUser(domain: Domain, user: User, domainSlot: CapturingSlot<Domain>, authorizations: Collection<DomainAccess>, operation: (DomainOperation) -> Unit) {
        // instantiate object to test
        val domainOperation = getDomainOperation()

        // check all authorized options for saving a domain
        for (testAccess in authorizations) {
            // mock returns
            every { userRepository.findById(any()) } returns
                Optional.of(user)

            every { userDomainAccessRepository.findByUserIdAndDomainId(any(), any()) } returns
                Optional.of(UserDomainAccess(user.id, domain.id, testAccess))

            every { domainRepository.save(capture(domainSlot)) } answers
                { domainSlot.captured }

            operation(domainOperation)
        }
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

    /**
     * Create test user with default values
     */
    private fun getTestUser(): User {
        return User(
            "user@test.test",
            "passTest",
            "displayTest",
            UserStatus.Approved
        )
    }
}
