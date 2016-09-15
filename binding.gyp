{
  "targets": [

    # MediaLibraryModel
    {
      "target_name": "MediaLibraryModel",
      "sources": [ '<!@(ls -1 lib/medialibrarymodel/*.cpp)' ],
      "link_settings": {
        "libraries": [
          "-ltag"
        ]
      },
      "cflags": [
        "-std=c++14"
      ]
    },


    # copies all modules to a universal location to keep the code simple
    {
      "target_name": "_LibCopy",
      "type": "none",
      "dependencies": [
        "MediaLibraryModel"
      ],
      "copies": [
        {
          "destination": "<(module_root_dir)/lib",
          "files": [
            "<(module_root_dir)/build/$(BUILDTYPE)/MediaLibraryModel.node"
          ]
        }
      ]
    }

  ]
}
