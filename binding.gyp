{
  "targets": [
    {
      "target_name": "GnuReadline",
      "sources": [ '<!@(ls -1 lib/readline/*.cpp)' ],
      "link_settings": {
        "libraries": [
            "-lreadline"
        ]
      }
    },
    {
      "target_name": "MediaLibraryModel",
      "sources": [ '<!@(ls -1 lib/medialibrarymodel/*.cpp)' ],
      "link_settings": {
        "libraries": [
            "-ltag"
        ]
      }
    }
  ]
}
