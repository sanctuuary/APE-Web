/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.user

import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus

/**
 * User info (safe) for transmission to the front-end
 *
 * @param email email address of user
 * @param displayName user's name that is visible on the website
 * @param status status of user (Pending, Approved, Revoked)
 * @param isAdmin does the user have admin status
 */
data class UserInfo(val userId: String, val email: String, val displayName: String, val status: UserStatus, val isAdmin: Boolean) {
    /**
     * Constructor using User entity from database. Only passes non-security information
     */
    constructor(user: User, isAdmin: Boolean) : this(user.id.toString(), user.email, user.displayName, user.status, isAdmin)
}
