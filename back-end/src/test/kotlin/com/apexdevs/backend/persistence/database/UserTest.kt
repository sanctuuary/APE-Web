/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database

import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.mongodb.MongoException
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.fail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@DataMongoTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("User domain tests")
class UserTest(@Autowired val mongoTemplate: MongoTemplate, @Autowired val userRepository: UserRepository) {
    private val userList = List<ObjectId>(10) { ObjectId.get() }

    @BeforeAll
    @DisplayName("User insertion test")
    fun userInsertionTest() {
        try {
            for (userId in userList) {
                userRepository.insert(User(userId, "$userId@test.com", "123", "test", UserStatus.Approved))
            }
        } catch (exception: MongoException) {
            fail(exception.message)
        }
    }

    /*
    @Test
    @DisplayName("User unique email constraint test")
    fun userUniqueEmailConstraintTest() {
        for (userId in userList) {
            try {
                //Insert new user with only the email field the same as before
                userRepository.insert(User(ObjectId.get(), "$userId@test.com", "321", "test2", "test2", UserStatus.Pending))
            }
            catch (exception: DuplicateKeyException) {
                //Intended exception, continue
                continue
            }
            catch (exception: MongoException) {
                fail("Unexpected exception thrown: ${exception.message}")
            }

            //No exception thrown, test failed
            fail("No duplicate key exception thrown on 'email', constraint test failed!")
        }
    }
    */

    @Test
    @DisplayName("User search test")
    fun userSearchTest() {
        try {
            val results = userRepository.findAllById(userList)

            // Assert that exactly the same amount of users were inserted and found as intended
            assertEquals(userList.count(), results.count())
        } catch (exception: MongoException) {
            fail(exception.message)
        }
    }
}
