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
data class UserInfo(val userId: String, var email: String?, val displayName: String, val status: UserStatus, val isAdmin: Boolean) {
    /**
     * Constructor using User entity from database. Only passes non-security information
     * @param user The user whose information to use.
     * @param isAdmin Whether the user is an administrator.
     * @param hideMail Whether the email address of the user should be hidden.
     */
    constructor(user: User, isAdmin: Boolean, hideMail: Boolean = false) :
        this(user.id.toString(), user.email, user.displayName, user.status, isAdmin) {
            // hide the user's email address when specified to do so
            if (hideMail) {
                this.email = null
            }
        }
}
