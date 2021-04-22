/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.exception

/**
 * Exception when a user approval request is not found in the database
 */
class UserApproveRequestNotFoundException(val from: Any, message: String) : RuntimeException(message)
