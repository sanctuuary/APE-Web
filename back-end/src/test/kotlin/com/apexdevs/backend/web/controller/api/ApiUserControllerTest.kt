/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.web.controller.entity.user.UserRegister
import com.mongodb.MongoException
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.dao.DuplicateKeyException
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.security.InvalidParameterException

internal class ApiUserControllerTest {

    private val mockUserOperation = mockk<UserOperation>()
    private val apiUserController = ApiUserController(mockUserOperation)
    private val register = UserRegister("Test", "Test", "Test", "Test")

    @Test
    fun loginUser() {
        assertEquals(Unit, apiUserController.loginUser())
    }

    @Test
    fun registerUser() {
        every { mockUserOperation.registerUser(any(), any(), any(), any()) } just Runs

        assertEquals(Unit, apiUserController.registerUser(register))
    }

    @Test
    fun `Conflict error when duplicate user`() {
        every { mockUserOperation.registerUser(any(), any(), any(), any()) } throws DuplicateKeyException("Test")

        val exc = assertThrows<ResponseStatusException> { apiUserController.registerUser(register) }
        assertEquals(HttpStatus.CONFLICT, exc.status)
    }

    @Test
    fun `Server error when mongo fail`() {
        every { mockUserOperation.registerUser(any(), any(), any(), any()) } throws MongoException("Test")

        val exc = assertThrows<ResponseStatusException> { apiUserController.registerUser(register) }
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exc.status)
    }

    @Test
    fun `Bad request when email address invalid`() {
        every { mockUserOperation.registerUser(any(), any(), any(), any()) } throws InvalidParameterException()

        val exc = assertThrows<ResponseStatusException> { apiUserController.registerUser(register) }
        assertEquals(HttpStatus.BAD_REQUEST, exc.status)
    }
}
