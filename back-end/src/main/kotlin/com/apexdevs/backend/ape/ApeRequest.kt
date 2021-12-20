/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape

import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.ape.entity.workflow.Ontology
import com.apexdevs.backend.ape.entity.workflow.OntologyNode
import com.apexdevs.backend.ape.entity.workflow.ParsedModuleNode
import com.apexdevs.backend.ape.entity.workflow.ParsedTypeNode
import com.apexdevs.backend.ape.entity.workflow.RunConfig
import com.apexdevs.backend.ape.entity.workflow.WorkflowOutput
import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.exception.RunParametersExceedLimitsException
import com.apexdevs.backend.persistence.exception.SynthesisFlagException
import guru.nidi.graphviz.attribute.Rank
import nl.uu.cs.ape.sat.APE
import nl.uu.cs.ape.sat.core.solutionStructure.AbstractCWLCreator
import nl.uu.cs.ape.sat.core.solutionStructure.ModuleNode
import nl.uu.cs.ape.sat.core.solutionStructure.SolutionsList
import nl.uu.cs.ape.sat.core.solutionStructure.TypeNode
import nl.uu.cs.ape.sat.models.enums.SynthesisFlag
import nl.uu.cs.ape.sat.models.logic.constructs.TaxonomyPredicate
import java.io.ByteArrayOutputStream
import java.nio.file.Path
import java.util.Locale
import javax.imageio.ImageIO

/**
 * Class that functions as the main interface for APE
 * @param domain the domain that APE needs to interact with
 * @param rootLocation the path of the domain folder
 * @param ape APE instantiated with the correct CoreConfig
 */
class ApeRequest(val domain: Domain, private val rootLocation: Path, val ape: APE, val runParametersOperation: RunParametersOperation) {
    private lateinit var solutions: SolutionsList
    /**
     * Takes a RunConfig object and adds two local paths and converts it to a JSON object to run the synthesis
     * @param runConfig The config provided that is used by APE to run it's synthesis
     * @return A list of solutions found by APE
     */
    private fun runWithConfig(runConfig: RunConfig) {
        val run = runConfig.toJSONObject()
        val constraintsPath = rootLocation.resolve("${domain.id}/constraints.json").toString()
        val solutionsPath = rootLocation.resolve(domain.id.toString()).toString()
        run.put("constraints_path", constraintsPath)
        run.put("solutions_dir_path", solutionsPath)

        solutions = ape.runSynthesis(run)
    }

    /**
     * Runs APE with the current config, then parses it to a suitable FE format
     * @param: The amount of workflows wanted
     * @throws RunParametersExceedLimitsException When the given config exceeds the configured run parameters limits
     * @throws SynthesisFlagException When the run is interrupted
     * @return: A list of resulting workflows
     */
    fun getWorkflows(runConfig: RunConfig): MutableList<WorkflowOutput> {
        // check if the given run parameters do not exceed the configured limits
        val limits = runParametersOperation.getGlobalRunParameters()
        if (runConfig.solutionMinLength > limits.maxLength ||
            runConfig.solutionMaxLength > limits.maxLength ||
            runConfig.maxDuration > limits.maxDuration ||
            runConfig.maxSolutionsToReturn > limits.solutions
        ) {
            throw RunParametersExceedLimitsException(this, "The given run parameters exceed the allowed maximum values.")
        }

        runWithConfig(runConfig)
        val resultingWorkflows = mutableListOf<WorkflowOutput>()

        // check if the run was interrupted
        if (solutions.flag != SynthesisFlag.NONE) {
            throw SynthesisFlagException(this, solutions.flag)
        }

        for (i in 0 until solutions.numberOfSolutions) {

            val solutionWorkflow = solutions.get(i)

            if (solutionWorkflow.moduleNodes.size> 0) {
                val workflowOutput = WorkflowOutput(
                    i,
                    parseTypeNodes(solutionWorkflow.workflowInputTypeStates),
                    parseTypeNodes(solutionWorkflow.workflowOutputTypeStates),
                    parseModuleNodes(solutionWorkflow.moduleNodes)
                )
                resultingWorkflows.add(workflowOutput)
            }
        }

        return resultingWorkflows
    }

    /**
     * Transforms a list of TypeNodes into a suitable format for FE
     * @param typeNodes a list of TypeNodes
     * @return a list of ParsedTypeNodes
     */
    private fun parseTypeNodes(typeNodes: List<TypeNode>): MutableList<ParsedTypeNode> {
        val parsedTypeNodes = mutableListOf<ParsedTypeNode>()
        typeNodes.forEach { node ->
            parsedTypeNodes.add(ParsedTypeNode(node.nodeID.removePrefixIRI(), node.nodeLabel))
        }
        return parsedTypeNodes
    }

    /**
     * Transforms a list of ModuleNode into a suitable format for FE
     * @param moduleNodes a list of moduleNodes
     * @return a list of ParsedModuleNode
     */
    private fun parseModuleNodes(moduleNodes: List<ModuleNode>): MutableList<ParsedModuleNode> {
        val parsedModuleNodes = mutableListOf<ParsedModuleNode>()
        moduleNodes.forEach { node ->
            parsedModuleNodes.add(ParsedModuleNode(node.nodeID.removePrefixIRI(), node.nodeLabel, parseTypeNodes(node.inputTypes), parseTypeNodes(node.outputTypes)))
        }
        return parsedModuleNodes
    }

    /**
     * Retrieves tool data from the ape domainSetup
     * @return the tools in the ontology format
     */
    val toolsOntology: Ontology
        get() {
            return Ontology(taxonomyCollectionToOntology(ape.domainSetup.allModules.rootPredicates))
        }

    /**
     * Retrieves the type data from the ape domainSetup
     * @return the input and output data from the ape domainSetup
     */
    val dataOntology: Ontology
        get() {
            return Ontology(taxonomyCollectionToOntology(ape.domainSetup.allTypes.rootPredicates))
        }

    /**
     * String extension to format taxonomy labels into a pretty printed label
     */
    private fun String.formatLabel(): String = replace("_", " ").split(" ").joinToString(" ") { it ->
        it.replaceFirstChar {
            if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
        }
    }

    private fun String.removePrefixIRI(): String = replace(domain.ontologyPrefixIRI, "").replace("\"", "")

    /**
     * Parses the sub taxonomy predicates to a list of ontology Nodes
     * @param taxonomyCollection collection of taxonomy predicates
     * @return: A list of ontologyNodes
     */
    private fun taxonomyCollectionToOntology(taxonomyCollection: Collection<TaxonomyPredicate>): MutableList<OntologyNode> {
        val ontologyNodes = mutableListOf<OntologyNode>()
        for (i in taxonomyCollection.indices) {
            val taxonomyPredicate = taxonomyCollection.elementAt(i)
            val label = taxonomyPredicate.predicateLabel
            val id = taxonomyPredicate.predicateID
            if (!taxonomyPredicate.subPredicates.isNullOrEmpty()) {
                ontologyNodes.add(OntologyNode(label.formatLabel(), id.removePrefixIRI(), taxonomyCollectionToOntology(taxonomyPredicate.subPredicates)))
            } else {
                ontologyNodes.add(OntologyNode(label.formatLabel(), id.removePrefixIRI(), null))
            }
        }
        return ontologyNodes
    }

    /**
     * Generate the abstract CWL representation of a certain solution.
     * @param index id of wanted solution
     * @return cwl content as a ByteArray
     */
    fun generateAbstractCwl(index: Int): ByteArray {
        if (::solutions.isInitialized)
            if (index > solutions.numberOfSolutions)
                throw Exception("This solution does not exist.")
            else
                return AbstractCWLCreator(solutions[index]).generate().toByteArray()
        else
            throw Exception("No solutions could be found with the given input and output")
    }

    /**
     * @param index id of wanted solution
     * @return bash content as a ByteArray
     */
    fun generateBash(index: Int): ByteArray {
        if (::solutions.isInitialized)
            if (index > solutions.numberOfSolutions)
                throw Exception("This solution does not exist.")
            else
                return solutions[index].scriptExecution.toByteArray()

        else
            throw Exception("No solutions could be found with the given input and output")
    }

    /**
     * @param index id of wanted solution
     * @return png content as a ByteArray
     */
    fun generatePNG(index: Int): ByteArray {
        if (::solutions.isInitialized)
            if (index > solutions.numberOfSolutions)
                throw Exception("This solution does not exist.")
            else {

                val image = solutions[index].getDataflowGraphPNG(Rank.RankDir.TOP_TO_BOTTOM)

                val outputStream = ByteArrayOutputStream()
                ImageIO.write(image, "png", outputStream)
                val png = outputStream.toByteArray()

                outputStream.close()

                return png
            } else
            throw Exception("No solutions could be found with the given input and output")
    }

    /**
     * Retrieves the constraint data from the ape domainSetup
     * @return: All constraints that belong to this domain
     */
    val constraints: List<Constraint>
        get() {
            val templates = ape.constraintTemplates
            val constraints = mutableListOf<Constraint>()

            for (t in templates) {
                val paramTypes = mutableListOf<String>()
                for (p in t.parameters) {
                    when (val type = p.parameterTemplateTypes[0].type) {
                        "type" -> paramTypes.add("data")
                        "abstract module" -> paramTypes.add("tool")
                        else -> paramTypes.add(type)
                    }
                }
                constraints.add(Constraint(t.constraintID, t.description, paramTypes))
            }
            return constraints
        }
}
