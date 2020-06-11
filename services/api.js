const axios = require('axios'),
    { SERVER_URL } = require('../utils/constant');

module.exports = {
    fetchCourses: (search, popular, offset, limit) => {
        return axios.post(`${SERVER_URL}/course`, { search, popular, offset, limit });
    }
}