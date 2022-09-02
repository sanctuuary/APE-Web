/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.web.security.SecurityMVCTestConfig
import com.apexdevs.backend.web.security.SecurityTestConfig
import com.ninjasquad.springmockk.MockkBean
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.http.MediaType
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@ExtendWith(SpringExtension::class, MockitoExtension::class)
@ContextConfiguration(
    classes = [SecurityMVCTestConfig::class, SecurityTestConfig::class, ApiUserController::class],
    initializers = [ConfigDataApplicationContextInitializer::class]
)
@WebAppConfiguration
class ApiUserControllerMVCTest(@Autowired val context: WebApplicationContext) {
    private val mockMvc: MockMvc = MockMvcBuilders.webAppContextSetup(context).apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity()).build()

    @MockkBean(relaxed = true)
    private lateinit var userOperation: UserOperation

    @Test
    @DisplayName("Assert user is created after register")
    fun `Assert user is created after register`() {
        println(">>Assert user is created after register")

        val requestJson = "{\"username\":\"test\",\"password\":\"test\",\"displayName\":\"test\",\"motivation\":\"test\"}"

        mockMvc.post("/api/user/register") {
            contentType = MediaType.APPLICATION_JSON
            content = requestJson
        }.andExpect {
            status { isCreated() }
        }
    }
}
