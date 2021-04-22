/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.collection.TopicCollection
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@ExtendWith(SpringExtension::class)
@ContextConfiguration(classes = [TopicController::class, SecurityMVCTestConfig::class, SecurityTestConfig::class])
@WebAppConfiguration
class TopicControllerMVCTest(@Autowired val context: WebApplicationContext) {
    @MockkBean(relaxed = true)
    private lateinit var userOperation: UserOperation
    @MockkBean
    private lateinit var topicCollection: TopicCollection

    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    @Test
    fun `Exception is thrown when something unexpected happens while retrieving all topics`() {
        every { topicCollection.getAllTopics() } throws NullPointerException()

        mockMvc.get("/topic/") {
        }.andExpect {
            status { isInternalServerError }
        }
    }
}
