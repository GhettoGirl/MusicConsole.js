#include "filesystemmodel.hpp"

#include <ftw.h>

// ugly workaround for unix ftw
std::vector<std::string> m_files;

FileSystemModel::FileSystemModel()
{
    m_valid = false;
}

FileSystemModel::~FileSystemModel()
{
    m_path.clear();
    m_files.clear();
}

bool FileSystemModel::setPath(const std::string &path)
{
    struct stat sb;
    if (stat(path.c_str(), &sb) == 0 && S_ISDIR(sb.st_mode) && sb.st_mode & S_IRUSR)
    {
        m_path = path;
        m_valid = true;
    }

    else
    {
        m_path.clear();
        m_valid = false;
    }

    return m_valid;
}

const std::string &FileSystemModel::path() const
{
    return m_path;
}

void FileSystemModel::scan()
{
    // skip if there is nothing to do
    if (!m_valid)
    {
        return;
    }

    ftw(m_path.c_str(), ftw_callback, 20); // != 0) <- error
}

void FileSystemModel::clear()
{
    m_files.clear();
}

const std::vector<std::string> &FileSystemModel::files() const
{
    return m_files;
}

int FileSystemModel::ftw_callback(const char *path, const struct stat *ptr, int)
{
    // we only need files
    // everything else makes no sense here
    // note: ftw uses stat() which follows symlinks
    if (!S_ISREG(ptr->st_mode))
    {
        return 0;
    }

    m_files.push_back(path);
    return 0;
}
