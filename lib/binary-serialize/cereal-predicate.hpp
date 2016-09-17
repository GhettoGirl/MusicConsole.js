#ifndef CEREAL_PREDICATE_HPP
#define CEREAL_PREDICATE_HPP

#include <cereal/types/vector.hpp>
#include <cereal/types/string.hpp>
#include <cereal/archives/binary.hpp>

#include <string>
#include <vector>
#include <fstream>

class DataRecord
{
public:
    DataRecord() = default;

    void setData(const std::vector<std::string> &data)
    {
        m_data = data;
    }

private:
    std::vector<std::string> m_data;

    friend class cereal::access;

    template <class Archive>
    void serialize(Archive &ar)
    {
        ar(CEREAL_NVP(m_data));
    }
};

#endif // CEREAL_PREDICATE_HPP
