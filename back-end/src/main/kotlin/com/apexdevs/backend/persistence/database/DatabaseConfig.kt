/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database

import com.mongodb.ConnectionString
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.DependsOn
import org.springframework.core.env.Environment
import org.springframework.data.mongodb.core.MongoOperations
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@Configuration
@EnableMongoRepositories
@EnableAutoConfiguration
class DatabaseConfig() {
    @Bean
    @DependsOn("mongoClient")
    fun mongoTemplate(mongo: MongoClient, @Value("\${spring.data.mongodb.database}") db: String): MongoOperations {
        val template = MongoTemplate(mongo, db)
        DatabaseConstraints.applyIndices(template)
        return template
    }

    @Bean
    fun mongoClient(@Autowired env: Environment): MongoClient {
        val uri = env.getProperty("spring.data.mongodb.uri")
        return if (uri != null) MongoClients.create(ConnectionString(uri)) else MongoClients.create()
    }
}
