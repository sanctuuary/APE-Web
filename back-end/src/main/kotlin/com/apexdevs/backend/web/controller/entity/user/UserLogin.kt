/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.user

/**
 * User login request
 *
 * @param username email address for authentication
 * @param password plain text secret for authentication
 */
data class UserLogin(
    val username: String,
    val password: String
)
