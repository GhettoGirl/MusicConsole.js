#ifndef FILESYSTEMMODEL_HPP
#define FILESYSTEMMODEL_HPP

#include <string>
#include <vector>

// just a small C++ wrapper for unix ftw to keep things simple
class FileSystemModel
{
public:
    FileSystemModel();
    ~FileSystemModel();

    // sets the root path
    // returns false if the path doesn't exists or isn't accessible
    bool setPath(const std::string &path);

    // returns the root path
    const std::string &path() const;

    // scans the directory recursively for files and appends them
    // to the internal file list
    // errors should not happen here
    // the function does nothing when 'setPath' returned false
    void scan();

    // clears the internal file list
    void clear();

    // returns a const reference to the internal file list
    const std::vector<std::string> &files() const;

private:
    bool m_valid = false;
    std::string m_path;

    static int ftw_callback(const char *path, const struct stat *ptr, int flags);
};

#endif // FILESYSTEMMODEL_HPP
