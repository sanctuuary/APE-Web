/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.filesystem

/**
 * The multiple file types used to store inside the specific domain folder
 */
enum class FileTypes(val type: String) {
    ToolsAnnotations("core/tool_annotations.json"),
    Ontology("core/ontology.owl"),
    UseCaseConstraints("use_cases/constraints.json"),
    UseCaseRunConfig("use_cases/run_config.json"),
    Constraints("constraints.json"),
}
