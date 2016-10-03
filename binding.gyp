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
      "conditions": [
        ['OS!="win"', {
          "link_settings": {
            "libraries": [
              "-ltag"
            ]
          }
        }]
      ],
      "cflags": [
        "-std=c++11"
      ]
    },

    # GnuReadline / WinEditline
    {
      "target_name": "readline",
      "conditions": [
        ['OS!="win"', {
          "sources": [
            "lib/readline/module_init.cpp",
            "lib/readline/readline.cpp"
          ],
          "link_settings": {
            "libraries": [
              "-lreadline"
            ]
          }
        }],
        ['OS=="win"', {
          "sources": [
            "lib/readline/module_init.cpp",
            "lib/readline/readline.cpp",
            "lib/readline/wineditline/src/editline.c",
            "lib/readline/wineditline/src/history.c",
            "lib/readline/wineditline/src/fn_complete.c"
          ],
          "include_dirs": [
            "lib/readline/wineditline/include",
            "lib/readline/wineditline/src"
          ],
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
