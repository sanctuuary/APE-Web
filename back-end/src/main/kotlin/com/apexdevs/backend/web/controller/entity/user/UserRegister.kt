/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.user

/**
 * User registration request
 *
 * @param username email address for authentication
 * @param password plain text password
 * @param displayName user's name that is visible on the website
 * @param motivation user's motivation for registration
 */
data class UserRegister(
    val username: String,
    val password: String,
    val displayName: String,
    val motivation: String
)
