[[_TOC_]]

# GET "/workflow/{domainId}"

Get a workflow associated with the domain.

This needs to be called before the api calls can be made. 
With this call APE gets instantiated to the right domain

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Returns

Returns a HttpStatus.OK
```
200
```

# POST "/api/workflow/run"

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Parameters

Required: 
- input `JSON array` = Array with the number of inputs provided as taxonomyRoots
  - taxonomyRoots `JSON Object` = Object with the dimensions and their values
- expectedOutput `JSON array` = Array with the number of outputs wanted as taxonomyRoots
  - taxonomyRoots `JSON Object` = Object with the dimensions and their values
- maxDuration `int` = The maximum duration of APE to run
- solutions `int` = The total amount of solutions expected from APE
- maxLength `int` = maximum length of the solution APE finds
- minLength `int` = minimum length of the solution APE finds

Optional: 
  - constraints `JSON` = format of the used constraints

```
{  
    "input":
    [
        {
            "taxonomyRoots":{
            "TypesTaxonomy": "XYZ_table_file"
            }
        }
    ], 
    "expectedOutput" :
    [
        {
            "taxonomyRoots":{
            "TypesTaxonomy": "PostScript"
            }
        }
    ],
    "constraints": [
      {
        "id": "ite_m",
        "parameters": [
                {
                    "taxonomyRoots":{
                        "ToolsTaxonomy":"Modules_with_xyz_file_output"
                    }
                },
                {
                     "taxonomyRoots":{
                        "ToolsTaxonomy":"Modules_with_xyz_file_input"
                    }
                }
        ]
      }
    ],
    "maxDuration":10,
    "solutions":10,
    "maxLength":10,
    "minLength":1
}
```
## Returns

Returns a HttpStatus.OK and a JSON

```
200
```
```
[
    {
        "inputTypeStates": [
            {
                "id": "PNG,Image_MemT0.0",
                "label": "PNG, Image"
            },
            {
                "id": "JPG,Content_MemT0.1",
                "label": "JPG, Content"
            }
        ],
        "outputTypeStates": [
            {
                "id": "BMP,Image_MemT4.0",
                "label": "BMP, Image"
            }
        ],
        "tools": [
            {
                "id": "append_vertically_Tool1",
                "label": "append_vertically",
                "inputTypes": [
                    {
                        "id": "PNG,Image_MemT0.0",
                        "label": "PNG, Image"
                    },
                    {
                        "id": "PNG,Image_MemT0.0",
                        "label": "PNG, Image"
                    }
                ],
                "outputTypes": [
                    {
                        "id": "PNG,Image_MemT1.0",
                        "label": "PNG, Image"
                    },
                    {
                        "id": "_MemT1.1",
                        "label": ""
                    }
                ]
            },
            {
                "id": "generate_color_Tool2",
                "label": "generate_color",
                "inputTypes": [],
                "outputTypes": [
                    {
                        "id": "String,Color_MemT2.0",
                        "label": "String, Color"
                    },
                    {
                        "id": "_MemT2.1",
                        "label": ""
                    }
                ]
            },
            {
                "id": "add_large_border_Tool3",
                "label": "add_large_border",
                "inputTypes": [
                    {
                        "id": "PNG,Image_MemT1.0",
                        "label": "PNG, Image"
                    },
                    {
                        "id": "String,Color_MemT2.0",
                        "label": "String, Color"
                    }
                ],
                "outputTypes": [
                    {
                        "id": "PNG,Image_MemT3.0",
                        "label": "PNG, Image"
                    },
                    {
                        "id": "_MemT3.1",
                        "label": ""
                    }
                ]
            },
            {
                "id": "to_bitmap_Tool4",
                "label": "to_bitmap",
                "inputTypes": [
                    {
                        "id": "PNG,Image_MemT3.0",
                        "label": "PNG, Image"
                    }
                ],
                "outputTypes": [
                    {
                        "id": "BMP,Image_MemT4.0",
                        "label": "BMP, Image"
                    },
                    {
                        "id": "_MemT4.1",
                        "label": ""
                    }
                ]
            }
        ]
    }
]
```
The output consists of the provided input and output types from the user, and the tools used. A tool has an Id, a label, inputTypes and outputTypes. The inputTypes may be empty, the tool is then a generator of it's own outputTypes. 


# POST "/api/workflow/config"

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Parameters

Required: 
- input `JSON array` = Array with the number of inputs provided as taxonomyRoots
  - taxonomyRoots `JSON Object` = Object with the dimensions and their values
- expectedOutput `JSON array` = Array with the number of outputs wanted as taxonomyRoots
  - taxonomyRoots `JSON Object` = Object with the dimensions and their values
- maxDuration `int` = The maximum duration of APE to run
- solutions `int` = The total amount of solutions expected from APE
- maxLength `int` = maximum length of the solution APE finds
- minLength `int` = minimum length of the solution APE finds

Optional: 
  - constraints `JSON` = format of the used constraints

```
{  
    "input":
    [
        {
            "taxonomyRoots":{
            "TypesTaxonomy": "XYZ_table_file"
            }
        }
    ], 
    "expectedOutput" :
    [
        {
            "taxonomyRoots":{
            "TypesTaxonomy": "PostScript"
            }
        }
    ],
    "constraints": [
      {
        "id": "ite_m",
        "parameters": [
                {
                    "taxonomyRoots":{
                        "ToolsTaxonomy":"Modules_with_xyz_file_output"
                    }
                },
                {
                     "taxonomyRoots":{
                        "ToolsTaxonomy":"Modules_with_xyz_file_input"
                    }
                }
        ]
      }
    ],
    "maxDuration":10,
    "solutions":10,
    "maxLength":10,
    "minLength":1
}
```
## Returns

Returns a HttpStatus.OK and a zip containing the config and constraints.

```
200
```

# GET "/api/workflow/data"

Retrieving the data formats and types

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Returns
Returns a HttpStatus.OK and a JSON with the following structure: 

```
200
```
```
{
    "roots": [
        {
            "label": "Format",
            "id": "Format",
            "children": [
                {
                    "label": "TextFormat",
                    "id": "TextFormat",
                    "children": [
                        {
                            "label": "String",
                            "id": "String",
                            "children": null
                        }
                    ]
                },
                {
                    "label": "ImageFormat",
                    "id": "ImageFormat",
                    "children": [
                        {
                            "label": "Compressed",
                            "id": "Compressed",
                            "children": [
                                {
                                    "label": "JPG",
                                    "id": "JPG",
                                    "children": null
                                }
                            ]
                        },
                        {
                            "label": "Lossless",
                            "id": "Lossless",
                            "children": [
                                {
                                    "label": "PNG",
                                    "id": "PNG",
                                    "children": null
                                },
                                {
                                    "label": "BMP",
                                    "id": "BMP",
                                    "children": null
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "label": "Type",
            "id": "Type",
            "children": [
                {
                    "label": "FontFamily",
                    "id": "FontFamily",
                    "children": null
                },
                {
                    "label": "Content",
                    "id": "Content",
                    "children": null
                },
                {
                    "label": "Canvas",
                    "id": "Canvas",
                    "children": [
                        {
                            "label": "Filter",
                            "id": "Filter",
                            "children": null
                        },
                        {
                            "label": "Image",
                            "id": "Image",
                            "children": null
                        }
                    ]
                },
                {
                    "label": "Color",
                    "id": "Color",
                    "children": null
                }
            ]
        }
    ]
}
```

# GET "/api/workflow/constraints"

Retrieves all possible constraints that can be used for workflow request specification.

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Returns

Returns a HttpStatus.OK and a JSON with the following structure:
```
200
```
```
[
    {
        "id": "use_m",
        "description": "Use operation ${parameter_1} in the solution.",
        "parameterTypes": ["tool"],
        "parameters": null,
        "tools": null
    },
    {
        "id": "use_t",
        "description": "Use type ${parameter_1} in the solution.",
        "parameterTypes": ["data"],
        "parameters": null,
        "tools": null
    },
    {
        "id": "ite_m",
        "description": "If operation ${parameter_1} was used, then operation ${parameter_2} must be used subsequently.",
        "parameterTypes": ["tool", "tool"],
        "parameters": null,
        "tools": null
    }
]
```
The key parameterTypes contains an array describing which parameters the constraint expects. For constraint with id "ite_m", it expects a tool and another tool subsequently. The "parameters" and "tools" keys can be ignored.


# GET "/api/workflow/tools"

Retrieves all available tools that can be used for workflow request specification.

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Returns

Returns a HttpStatus.OK and a JSON with the following structure:
```
200
```
```
{
    "roots": [
        {
            "label": "Tool",
            "id": "Tool",
            "children": [
                {
                    "label": "Coloring",
                    "id": "Coloring",
                    "children": [..]
                }
             ]
        {
    ]
}
```
# GET "/api/workflow/useCaseConfig"

Retrieves the use-case-config that can be used for workflow request specification.

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Returns

Returns a HttpStatus.OK and a JSON with the following structure:
```
200
```
```
{
	"inputs": [
		{
			"Type": [
				"Image"
			],
			"Format": [
				"PNG"
			]
		},
		{
			"Type": [
				"Content"
			]
		}
	],
	"outputs": [
		{
			"Type": [
				"Image"
			],
			"Format": [
				"Lossless"
			]
		}
	],
	"solution_length": {
		"min": 1,
		"max": 8
	},
	"max_solutions": "1000",
	"timeout_sec": "20"
}
```

# GET "/api/workflow/useCaseConstraints"

Retrieves the use-case-cosntraints that can be used for workflow request specification.

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Returns

Returns a HttpStatus.OK and a JSON with the following structure:
```
200
```
```
{
  "constraints": [
    {
      "constraintid": "use_m",
      "parameters": [
        {
          "Tool": [
            "Borders"
          ]
        }
      ]
    }
  ]
}
```

# GET "/api/workflow/cwl/{solution-id}"

Get the CWL(s) for the specified workflow(s).

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Parameters

Required:
- solution-id `List<int> as pathVariable` 

## Returns

Returns a HttpStatus.OK. And a prompt to save the file to your filesystem.
```
200
```

# GET "/api/workflow/bash/{solution-id}"

Get the bash-script(s) for the specified workflow(s).

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Parameters

Required:
- solution-id `List<int> as pathVariable` 

## Returns

Returns a HttpStatus.OK. And a prompt to save the file to your filesystem.
```
200
```

# GET "/api/workflow/png/{solution-id}"

Download the png image(s) for the specified workflow(s).

## Authorization

None for public domains.

Private domains require authenticated user with explicit access to the domain.

## Parameters

Required:
- solution-id `List<int> as pathVariable` 

## Returns

Returns a HttpStatus.OK. And a prompt to save the file to your filesystem.
```
200
```