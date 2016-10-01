{
  "targets": [

    # TagReader
    {
      "target_name": "tagreader",
      "sources": [ '<!@(ls -1 lib/tagreader/*.cpp)' ],
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
      "sources": [ '<!@(ls -1 lib/readline/*.cpp)' ], # does this work on windows?
      "conditions": [
        ['OS=="windows"', {
          "link_settings": {
            "libraries": [
              "-lwineditline" # placeholder
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
      "sources": [ '<!@(ls -1 lib/kbhit/*.cpp)' ]
    },

    # random_mt19937
    {
      "target_name": "random_mt19937",
      "sources": [ '<!@(ls -1 lib/random_mt19937/*.cpp)' ],
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
