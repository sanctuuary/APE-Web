/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@TestConfiguration
@EnableAutoConfiguration
@EnableMongoRepositories
class DatabaseTestConfig
