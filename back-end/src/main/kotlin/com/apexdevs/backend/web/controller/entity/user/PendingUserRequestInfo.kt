/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.user

import java.util.Date

/**
 * Format in which BE sends the information about all pending approval requests
 * @param: Id of request (not user),
 * Username/Email of user who is pending,
 * User's display name,
 * Motivation text the user provided for their approval request,
 * Date on which the request was created
 */
data class PendingUserRequestInfo(
    val id: String,
    val email: String,
    val displayName: String,
    val motivation: String,
    val creationDate: Date
)
