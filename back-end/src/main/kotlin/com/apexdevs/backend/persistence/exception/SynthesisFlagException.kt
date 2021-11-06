package com.apexdevs.backend.persistence.exception

import nl.uu.cs.ape.sat.models.enums.SynthesisFlag

class SynthesisFlagException(val from: Any, val flag: SynthesisFlag) : RuntimeException(flag.message) {
    /**
     * Overrides some of APE's SynthesisFlag messages with user-friendly messages which can be shown on the front-end.
     * @return A user-friendly message describing the reason the synthesis was interrupted.
     */
    fun getFriendlyMessage(): String {
        return when (flag) {
            SynthesisFlag.TIMEOUT -> "Synthesis was interrupted because it reached the max duration."
            else -> flag.message
        }
    }
}
