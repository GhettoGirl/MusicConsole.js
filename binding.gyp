{
  "targets": [

    # TagReader
    {
      "target_name": "tagreader",
      "sources": [
        "lib/tagreader/module_init.cpp",
        "lib/tagreader/tagreader.cpp",
        "lib/tagreader/tagreaderprivate.cpp"
      ],
      "link_settings": {
        "libraries": [
          "-ltag"
        ]
      },
      "cflags": [
        "-std=c++11"
      ]
    },

    # GnuReadline / WinEditline
    {
      "target_name": "readline",
      "sources": [
        "lib/readline/module_init.cpp",
        "lib/readline/readline.cpp"
      ],
      "conditions": [
        ['OS=="windows"', {
          "link_settings": {
            "conditions": [
              ['ARCH=="i686"', {
                "libraries": [
                  "-lwineditline32" # placeholder
                ]
              }],
              ['ARCH=="x86_64"', {
                "libraries": [
                  "-lwineditline64" # placeholder
                ]
              }]
            ]
          }
        }],
        ['OS!="windows"', {
          "link_settings": {
            "libraries": [
              "-lreadline"
            ]
          }
        }]
      ],
      "cflags": [
        "-std=c++11"
      ]
    },

    # kbhit
    {
      "target_name": "kbhit",
      "sources": [
        "lib/kbhit/kbhit.cpp"
      ]
    },

    # random_mt19937
    {
      "target_name": "random_mt19937",
      "sources": [
        "lib/random_mt19937/mt19937.cpp"
      ],
      "cflags": [
        "-std=c++11"
      ]
    },


    # copies all modules to a universal location to keep the code simple
    {
      "target_name": "_LibCopy",
      "type": "none",
      "dependencies": [
        "tagreader",
        "readline",
        "kbhit",
        "random_mt19937"
      ],
      "copies": [
        {
          "destination": "<(module_root_dir)/lib",
          "files": [
            "<(module_root_dir)/build/$(BUILDTYPE)/tagreader.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/readline.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/kbhit.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/random_mt19937.node"
          ]
        }
      ]
    }

  ] # targets
}
