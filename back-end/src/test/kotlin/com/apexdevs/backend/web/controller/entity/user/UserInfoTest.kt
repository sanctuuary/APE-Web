package com.apexdevs.backend.web.controller.entity.user

import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

internal class UserInfoTest {
    /**
     * Test if the regular constructor works.
     */
    @Test
    fun regularConstructor() {
        val user = User(ObjectId(), "user@test.test", "test", "test", UserStatus.Approved)
        val userInfo = UserInfo(user, false)
        assertEquals(userInfo.userId, user.id.toString())
        assertNull(userInfo.email)
        assertEquals(userInfo.displayName, user.displayName)
        assertEquals(userInfo.status, user.status)
        assertEquals(userInfo.isAdmin, false)
    }

    /**
     * Test if the optional "includeEmail" argument works as intended.
     */
    @Test
    fun includeEmailConstructor() {
        val user = User(ObjectId(), "user@test.test", "test", "test", UserStatus.Approved)
        val isAdmin = true
        val userInfo = UserInfo(user, isAdmin, true)
        assertEquals(userInfo.userId, user.id.toString())
        assertEquals(userInfo.email, user.email)
        assertEquals(userInfo.displayName, user.displayName)
        assertEquals(userInfo.status, user.status)
        assertEquals(userInfo.isAdmin, isAdmin)
    }
}
