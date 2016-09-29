{
  "targets": [

    # TagReader
    {
      "target_name": "TagReader",
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

    # GnuReadline
    {
      "target_name": "GnuReadline",
      "sources": [ '<!@(ls -1 lib/readline/*.cpp)' ],
      "link_settings": {
        "libraries": [
          "-lreadline"
        ]
      },
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
        "TagReader",
        "GnuReadline",
        "kbhit",
        "random_mt19937"
      ],
      "copies": [
        {
          "destination": "<(module_root_dir)/lib",
          "files": [
            "<(module_root_dir)/build/$(BUILDTYPE)/TagReader.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/GnuReadline.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/kbhit.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/random_mt19937.node"
          ]
        }
      ]
    }

  ] # targets
}
