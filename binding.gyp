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

    # binary-serialize
    {
      "target_name": "binary-serialize",
      "sources": [ '<!@(ls -1 lib/binary-serialize/*.cpp)' ],
      "include_dirs": [
        "lib/binary-serialize/cereal/include"
      ],
      "cflags": [
        "-std=c++11"
      ],
      # for some reason node-gyp disables some features which are required by cereal
      "cflags_cc!": [
        "-fno-rtti",
        "-fno-exceptions"
      ]
    },


    # copies all modules to a universal location to keep the code simple
    {
      "target_name": "_LibCopy",
      "type": "none",
      "dependencies": [
        "TagReader",
        "binary-serialize"
      ],
      "copies": [
        {
          "destination": "<(module_root_dir)/lib",
          "files": [
            "<(module_root_dir)/build/$(BUILDTYPE)/TagReader.node",
            "<(module_root_dir)/build/$(BUILDTYPE)/binary-serialize.node"
          ]
        }
      ]
    }

  ]
}
