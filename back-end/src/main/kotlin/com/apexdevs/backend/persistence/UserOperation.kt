/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.*
import com.apexdevs.backend.persistence.database.repository.UserAdminRepository
import com.apexdevs.backend.persistence.database.repository.UserApproveRequestRepository
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.persistence.exception.UserApproveRequestNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.user.PendingUserRequestInfo
import org.apache.commons.validator.routines.EmailValidator
import org.bson.types.ObjectId
import org.springframework.dao.DuplicateKeyException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.security.InvalidParameterException
import java.util.*

/**
 * Performs managed user operations on the database
 *
 * @param userRepository (autowired)
 * @param passwordEncoder (autowired)
 */
@Component
class UserOperation(
    val userRepository: UserRepository,
    val userApproveRequestRepository: UserApproveRequestRepository,
    val userAdminRepository: UserAdminRepository,
    val passwordEncoder: PasswordEncoder
) {
    /**
     * Register a new user
     * @param email is the username for authentication
     * @param password is the plain text password
     * @param displayName is the user's visible name on the website
     */
    @Throws(DuplicateKeyException::class, InvalidParameterException::class)
    fun registerUser(email: String, password: String, displayName: String, motivation: String) {
        // throw exception if email is invalid
        val validator = EmailValidator.getInstance()
        if (!validator.isValid(email))
            throw InvalidParameterException("$email is not a valid email address.")

        // throw exception if email exists
        val userResult = userRepository.findByEmail(email)
        if (userResult.isPresent)
            throw DuplicateKeyException(email)

        val user = User(email, passwordEncoder.encode(password), displayName, UserStatus.Pending)

        // add user to database
        userRepository.insert(user)
        userApproveRequestRepository.insert(UserApproveRequest(user.id, motivation, UserRequest.Pending))
    }

    /**
     * Returns the user entity with this email address
     * @param email is user's email address
     */
    @Throws(UserNotFoundException::class)
    fun getByEmail(email: String): User {
        val userResult = userRepository.findByEmail(email)
        if (userResult.isEmpty)
            throw UserNotFoundException(this, "User with email: $email not found")

        return userResult.get()
    }

    /**
     * Check if user has active admin status
     * @param email unique identifier of user
     * @return true if user has active admin status, false otherwise
     */
    @Throws(UserNotFoundException::class)
    fun userIsAdmin(email: String): Boolean {
        // find user in database
        val user = getByEmail(email)
        // find admin status in database
        val userAdminResult = userAdminRepository.findByUserIdAndAdminStatus(user.id, AdminStatus.Active)
        // return whether admin status is present
        return userAdminResult.isPresent
    }

    /**
     * Approves the user request for the specified user
     * @param email unique identifier of the user
     * @param request approval request id to handle
     */
    @Throws(UserNotFoundException::class, UserApproveRequestNotFoundException::class)
    fun approveUser(email: String, request: ObjectId) {
        setUserApproval(email, request, UserRequest.Approved)
    }

    /**
     * Declines the user request for the specified user
     * @param email unique identifier of the user
     * @param request approval request id to handle
     */
    @Throws(UserNotFoundException::class, UserApproveRequestNotFoundException::class)
    fun declineUser(email: String, request: ObjectId) {
        setUserApproval(email, request, UserRequest.Denied)
    }

    /**
     * Updates the user status, by changing the request status and user status in the database
     */
    @Throws(UserNotFoundException::class, UserApproveRequestNotFoundException::class)
    private fun setUserApproval(email: String, request: ObjectId, status: UserRequest) {
        // get user or propagate exception
        val user = getByEmail(email)

        // make sure user is actually pending
        if (user.status != UserStatus.Pending)
            throw IllegalStateException("User with email: $email is already approved or revoked")

        // set new user status
        user.status = if (status == UserRequest.Approved) { UserStatus.Approved } else { UserStatus.Revoked }

        // get user request
        val userApproveRequestResult = userApproveRequestRepository.findById(request)
        if (userApproveRequestResult.isEmpty)
            throw UserApproveRequestNotFoundException(this, "User approve request not found for user: $email")

        // set request to approved and save result to database
        val userApproveRequest = userApproveRequestResult.get()

        // make sure the request was still pending
        if (userApproveRequest.status != UserRequest.Pending)
            throw IllegalStateException("User approve request was already used for user: $email")

        // set user status
        userApproveRequest.status = status

        // save user and request to database
        userRepository.save(user)
        userApproveRequestRepository.save(userApproveRequest)
    }

    /**
     * Collects all unapproved approve requests, including additional info (username, display name, motivation, creation date)
     * @return: List of PendingUserRequestInfo, null if there are no pending requests. Ordered from oldest to newest.
     */
    @Throws(UserNotFoundException::class)
    fun getPendingRequests(): List<PendingUserRequestInfo> {
        // find all pending users
        val requests = userApproveRequestRepository.findByStatus(UserRequest.Pending)

        // return empty list if there aren't any pending approval requests
        if (requests.isEmpty())
            return emptyList()
        else { // otherwise return all requests in a list
            var pendingInfo = mutableListOf<PendingUserRequestInfo>()

            for (rq in requests) {
                val user = userRepository.findById(rq.userId)

                // check if user exists in user repository
                if (user.isEmpty)
                    throw UserNotFoundException(this, "Discrepancy between user repository and approve request repository. User with id ${rq.userId} not found.")

                // if so, get info of request and user
                val u = user.get()
                val info = PendingUserRequestInfo(rq.id.toHexString(), u.email, u.displayName, rq.motivation, rq.id.date)
                pendingInfo.add(info)
            }

            return pendingInfo
        }
    }

    /**
     * Get all approved users.
     */
    fun approvedUsers(): List<User> {
        val approved = userApproveRequestRepository.findByStatus(UserRequest.Approved)

        return if (approved.isEmpty())
            emptyList()
        else
            approved.map { a -> userRepository.findById(a.userId).get() }
    }

    /**
     * Set the AdminStatus of a user.
     * @throws UserNotFoundException When no user with the given userId could be found.
     */
    fun setUserAdminStatus(userId: ObjectId, adminStatus: AdminStatus) {
        // Check if the user exists
        val user = userRepository.findById(userId)
        if (user.isEmpty) {
            throw UserNotFoundException(this, "User with id: $userId not found")
        }

        val existing = userAdminRepository.findByUserId(userId)
        if (existing.isPresent) {
            // Edit a previously revoked UserAdmin entry
            val userAdmin = existing.get()
            val updated = UserAdmin(
                userAdmin.id,
                userAdmin.userId,
                adminStatus
            )
            userAdminRepository.save(updated)
        } else {
            // Add a new UserAdmin entry
            val new = UserAdmin(
                userId,
                adminStatus
            )
            userAdminRepository.insert(new)
        }
    }
}
