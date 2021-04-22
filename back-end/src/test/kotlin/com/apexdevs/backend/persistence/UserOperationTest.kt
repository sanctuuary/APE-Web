/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.AdminStatus
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserAdmin
import com.apexdevs.backend.persistence.database.entity.UserApproveRequest
import com.apexdevs.backend.persistence.database.entity.UserRequest
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.UserAdminRepository
import com.apexdevs.backend.persistence.database.repository.UserApproveRequestRepository
import com.apexdevs.backend.persistence.database.repository.UserRepository
import com.apexdevs.backend.persistence.exception.UserApproveRequestNotFoundException
import com.apexdevs.backend.persistence.exception.UserNotFoundException
import com.apexdevs.backend.web.controller.entity.user.PendingUserRequestInfo
import io.mockk.CapturingSlot
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import org.bson.types.ObjectId
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.dao.DuplicateKeyException
import org.springframework.security.crypto.password.PasswordEncoder
import java.security.InvalidParameterException
import java.text.SimpleDateFormat
import java.util.Optional

class UserOperationTest {
    /**
     * Method: approveUser
     */
    @Test
    fun `Assert user approval alters entities`() {
        // create capturing slots
        val userSlot = slot<User>()
        val requestSlot = slot<UserApproveRequest>()

        // prepare user operation instance with mocking and capturing
        val userOperation = prepareUserApproval(userSlot, requestSlot)
        userOperation.approveUser("user@test.test", ObjectId.get())

        // check if approval result is correct
        assert(userSlot.isCaptured)
        assert(userSlot.captured.status == UserStatus.Approved)

        assert(requestSlot.isCaptured)
        assert(requestSlot.captured.status == UserRequest.Approved)
    }

    /**
     * Method: declineUser
     */
    @Test
    fun `Assert decline user sends correct user approval`() {
        // create capturing slots
        val userSlot = slot<User>()
        val requestSlot = slot<UserApproveRequest>()

        // prepare user operation instance with mocking and capturing
        val userOperation = prepareUserApproval(userSlot, requestSlot)
        userOperation.declineUser("user@test.test", ObjectId.get())

        // check if approval result is correct
        assert(userSlot.isCaptured)
        assert(userSlot.captured.status == UserStatus.Revoked)

        assert(requestSlot.isCaptured)
        assert(requestSlot.captured.status == UserRequest.Denied)
    }

    /**
     * Prepares user approval testing for approveUser and declineUser
     */
    private fun prepareUserApproval(userSlot: CapturingSlot<User>, requestSlot: CapturingSlot<UserApproveRequest>): UserOperation {
        // prepare test data
        val user = User("user@test.test", "passTest", "displayTest", UserStatus.Pending)

        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // set mocking returns
        every { userRepository.findByEmail(any()) } returns
            Optional.of(user)

        every { userApproveRequestRepository.findById(any()) } returns
            Optional.of(UserApproveRequest(user.id, "motivation", UserRequest.Pending))

        // set capture on user and user approve request
        every { userRepository.save(capture(userSlot)) } answers { userSlot.captured }

        every { userApproveRequestRepository.save(capture(requestSlot)) } answers { requestSlot.captured }

        // return prepared instance for method testing
        return userOperation
    }

    /**
     * Method: approveUser
     */
    @Test
    fun `Assert user approval throws if user not pending`() {
        // prepare test data
        val user = User("user@test.test", "passTest", "displayTest", UserStatus.Revoked)

        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // set mocking returns
        every { userRepository.findByEmail(any()) } returns
            Optional.of(user)

        // run method and check if exception is thrown
        assertThrows<IllegalStateException> {
            userOperation.approveUser("user@test.test", ObjectId.get())
        }
    }

    /**
     * Method: approveUser
     */
    @Test
    fun `Assert user approval throws if approve request is empty`() {
        // prepare test data
        val user = User("user@test.test", "passTest", "displayTest", UserStatus.Pending)

        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // set mocking returns
        every { userRepository.findByEmail(any()) } returns
            Optional.of(user)

        every { userApproveRequestRepository.findById(any()) } returns
            Optional.empty()

        // run method and check if exception is thrown
        assertThrows<UserApproveRequestNotFoundException> {
            userOperation.approveUser("user@test.test", ObjectId.get())
        }
    }

    /**
     * Method: approveUser
     */
    @Test
    fun `Assert user approval throws if approve request has wrong status`() {
        // prepare test data
        val user = User("user@test.test", "passTest", "displayTest", UserStatus.Pending)

        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // set mocking returns
        every { userRepository.findByEmail(any()) } returns
            Optional.of(user)

        every { userApproveRequestRepository.findById(any()) } returns
            Optional.of(UserApproveRequest(user.id, "motivationTest", UserRequest.Denied))

        // run method and check if exception is thrown
        assertThrows<IllegalStateException> {
            userOperation.approveUser("user@test.test", ObjectId.get())
        }
    }

    /**
     * Method: userIsAdmin
     */
    @Test
    fun `Assert user is admin for admins`() {
        // prepare test data
        val user = User(ObjectId.get(), "test@test.test", "test", "test", UserStatus.Pending)
        val userAdmin = UserAdmin(ObjectId.get(), user.id, AdminStatus.Active)

        // create user operation for user and userAdmin
        val userOperation = userIsAdminUserOperation(user, userAdmin)

        // assert is admin return
        assert(userOperation.userIsAdmin(user.email))
    }

    /**
     * Method: userIsAdmin
     */
    @Test
    fun `Assert user is admin for revoked admins`() {
        // prepare test data
        val user = User(ObjectId.get(), "test@test.test", "test", "test", UserStatus.Pending)
        val userAdmin = UserAdmin(ObjectId.get(), user.id, AdminStatus.Revoked)

        // create user operation for user and userAdmin
        val userOperation = userIsAdminUserOperation(user, userAdmin)

        // assert is admin return
        assert(!userOperation.userIsAdmin(user.email))
    }

    /**
     * Method: userIsAdmin
     */
    @Test
    fun `Assert user is admin for regular users`() {
        // prepare test data
        val user = User(ObjectId.get(), "test@test.test", "test", "test", UserStatus.Pending)

        // create user operation for user and userAdmin
        val userOperation = userIsAdminUserOperation(user, null)

        // assert is admin return
        assert(!userOperation.userIsAdmin(user.email))
    }

    /**
     * Method: getPendingRequests
     */
    @Test
    fun `Assert an empty list is given when there are no pending requests`() {
        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // userApproveRequestRepository is empty collection, there are no pending users
        every { userApproveRequestRepository.findByStatus(UserRequest.Pending) } returns emptyList()

        // so getPendingRequests() should return an empty list
        assert(userOperation.getPendingRequests() == emptyList<PendingUserRequestInfo>())
    }

    /**
     * Method: getPendingRequests
     */
    @Test
    fun `Assert list of pending requests is complete and formatted correctly`() {
        // setup mock repositories
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // make sure date is retrieved
        val dateFormat = SimpleDateFormat("dd-MM-yyyy")
        val id1 = ObjectId(dateFormat.parse("12-07-1999"))
        val id2 = ObjectId(dateFormat.parse("25-04-1996"))
        val id3 = ObjectId(dateFormat.parse("03-05-2000"))

        // user ids
        val user1 = ObjectId()
        val user2 = ObjectId()
        val user3 = ObjectId()

        // mock pending users
        val pendingUsers = listOf(
            UserApproveRequest(id1, user1, "test1", UserRequest.Pending),
            UserApproveRequest(id2, user2, "test2", UserRequest.Pending),
            UserApproveRequest(id3, user3, "test3", UserRequest.Pending)
        )

        // create userOperation instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // mock operations
        every { userApproveRequestRepository.findByStatus(UserRequest.Pending) } returns pendingUsers
        every { userRepository.findById(user1) } returns Optional.of(User("user1@test.test", "pw", "emmy", UserStatus.Pending))
        every { userRepository.findById(user2) } returns Optional.of(User("user2@test.test", "pw", "mike", UserStatus.Pending))
        every { userRepository.findById(user3) } returns Optional.of(User("user3@test.test", "pw", "sora", UserStatus.Pending))

        // set expected results
        val expectedResult = listOf(
            PendingUserRequestInfo(id1.toHexString(), "user1@test.test", "emmy", "test1", id1.date),
            PendingUserRequestInfo(id2.toHexString(), "user2@test.test", "mike", "test2", id2.date),
            PendingUserRequestInfo(id3.toHexString(), "user3@test.test", "sora", "test3", id3.date)
        )

        assert(userOperation.getPendingRequests() == expectedResult)
    }

    /**
     * Method: getPendingRequests
     */
    @Test
    fun `Assert function raises an exception when there's a discrepancy between user repo and approve-request repo`() {
        // setup mock repositories
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // user ids
        val user1 = ObjectId()
        val user2 = ObjectId()
        val user3 = ObjectId()

        // mock pending users
        val pendingUsers = listOf(
            UserApproveRequest(ObjectId(), user1, "test1", UserRequest.Pending),
            UserApproveRequest(ObjectId(), user2, "test2", UserRequest.Pending),
            UserApproveRequest(ObjectId(), user3, "test3", UserRequest.Pending)
        )

        // create userOperation instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // mock operations, one user does not exist in user repository
        every { userApproveRequestRepository.findByStatus(UserRequest.Pending) } returns pendingUsers
        every { userRepository.findById(user1) } returns Optional.of(User("user1@test.test", "pw", "emmy", UserStatus.Pending))
        every { userRepository.findById(user2) } returns Optional.empty()
        every { userRepository.findById(user3) } returns Optional.of(User("user3@test.test", "pw", "sora", UserStatus.Pending))

        assertThrows<UserNotFoundException> {
            userOperation.getPendingRequests()
        }
    }

    /**
     * Method: getByEmail
     */
    @Test
    fun `Assert get by email returns user`() {
        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // mock results
        every { userRepository.findByEmail(any()) } returns
            Optional.of(User("user@test.test", "test", "test", UserStatus.Approved))

        // assert return value
        val user = userOperation.getByEmail("user@test.test")
        assert(user.email == "user@test.test")
        assert(user.password == "test")
        assert(user.displayName == "test")
        assert(user.status == UserStatus.Approved)
    }

    /**
     * Method: getByEmail
     */
    @Test
    fun `Assert get by email throws exception`() {
        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // mock results
        every { userRepository.findByEmail(any()) } returns
            Optional.empty()

        // assert exception thrown
        assertThrows<UserNotFoundException> {
            userOperation.getByEmail("user@test.test")
        }
    }

    /**
     * Method: registerUser
     */
    @Test
    fun `Assert user registers with correct request`() {
        // create mocking objects
        val userRepository = mockk<UserRepository>(relaxed = true)
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>(relaxed = true)
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // mock values
        every { userRepository.findByEmail(any()) } returns
            Optional.empty()

        val passSlot = CapturingSlot<String>()
        val userSlot = CapturingSlot<User>()
        val approveSlot = CapturingSlot<UserApproveRequest>()

        every { passwordEncoder.encode(capture(passSlot)) } answers
            { passSlot.captured }

        every { userRepository.insert(capture(userSlot)) } answers
            { userSlot.captured }

        every { userApproveRequestRepository.insert(capture(approveSlot)) } answers
            { approveSlot.captured }

        // run method
        userOperation.registerUser("user@test.com", "passTest", "displayTest", "motivationTest")

        // assert captured values
        assert(userSlot.isCaptured)
        val user = userSlot.captured
        assert(user.email == "user@test.com")
        assert(user.password == "passTest") // password encoder was mocked to return plain text
        assert(user.displayName == "displayTest")

        assert(approveSlot.isCaptured)
        val approve = approveSlot.captured
        assert(approve.userId == user.id)
        assert(approve.motivation == "motivationTest")
        assert(approve.status == UserRequest.Pending)
    }

    /**
     * Method: registerUser
     */
    @Test
    fun `Assert user registers throws user already exists`() {
        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // mock values
        every { userRepository.findByEmail(any()) } returns
            Optional.of(User("user@test.com", "passTest", "displayTest", UserStatus.Approved))

        // assert exception is thrown
        assertThrows<DuplicateKeyException> {
            userOperation.registerUser("user@test.com", "passTest", "displayTest", "motivationTest")
        }
    }

    /**
     * Method: registerUser
     */
    @Test
    fun `Assert exception is thrown when email address is invalid`() {
        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // assert exception is thrown
        assertThrows<InvalidParameterException> {
            userOperation.registerUser("test", "passTest", "displayTest", "motivationTest")
        }
        assertThrows<InvalidParameterException> {
            userOperation.registerUser("test@test", "passTest", "displayTest", "motivationTest")
        }
        assertThrows<InvalidParameterException> {
            userOperation.registerUser("test@test.123", "passTest", "displayTest", "motivationTest")
        }
    }

    /**
     * Creates user operation with mocked repositories and password encoder
     */
    private fun userIsAdminUserOperation(user: User, userAdmin: UserAdmin?): UserOperation {
        // create mocking objects
        val userRepository = mockk<UserRepository>()
        val userApproveRequestRepository = mockk<UserApproveRequestRepository>()
        val userAdminRepository = mockk<UserAdminRepository>()
        val passwordEncoder = mockk<PasswordEncoder>()

        // create testing instance
        val userOperation = UserOperation(userRepository, userApproveRequestRepository, userAdminRepository, passwordEncoder)

        // set mocking returns
        every { userRepository.findByEmail(any()) } returns
            Optional.of(user)

        if (userAdmin != null) {
            // return active user admin only if given user admin is set to active
            if (userAdmin.adminStatus == AdminStatus.Active) {
                every { userAdminRepository.findByUserIdAndAdminStatus(any(), AdminStatus.Active) } returns
                    Optional.of(userAdmin)
            } else {
                every { userAdminRepository.findByUserIdAndAdminStatus(any(), AdminStatus.Active) } returns
                    Optional.empty()
            }
        } else {
            every { userAdminRepository.findByUserIdAndAdminStatus(any(), any()) } returns
                Optional.empty()
        }

        return userOperation
    }
}
