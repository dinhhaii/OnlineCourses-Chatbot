const axios = require('axios'),
    queryString = require('query-string'),
    { SERVER_URL, CHATBOT_URL } = require('../utils/constant');

module.exports = {
    fetchCourses: (search, popular, offset, limit) => {
        return axios.post(`${SERVER_URL}/course`, { search, popular, offset, limit });
    },

    fetchSubjects: (search, offset, limit) => {
        const query = queryString.stringify({
            search, limit, offset
        });
        return axios.get(`${SERVER_URL}/subject?${query}`);
    },

    fetchUser: (id) => {
        return axios.get(`${SERVER_URL}/user/${id}`);
    },

    fetchUserByEmail: (email) => {
        return axios.get(`${SERVER_URL}/user?email=${email}`);
    },

    fetchCart: (idUser) => {
        return axios.get(`${SERVER_URL}/cart/${idUser}`);
    },

    updateUser: (props) => {
        const { _id, _idUser } = props;
        if (!_idUser && _id) {
            props._idUser = _id;
        }
        delete props.createdAt;
        delete props.updatedAt;

        return axios.post(`${SERVER_URL}/user/update`, { ...props });
    },

    createUser: (props) => {
        return axios.post(`${SERVER_URL}/user/register`, { ...props });
    },

    updateCart: (props) => {
        const { _id, _idCart } = props;
        if (!_idCart && _id) {
            props._idCart = _id;
        }
        return axios.post(`${SERVER_URL}/cart/update`, { ...props });
    },

    createCart: (props) => {
        return axios.post(`${SERVER_URL}/cart/create`, { ...props });
    },

    sendEmail: (email, idFacebook) => {
        return axios.get(`${CHATBOT_URL}/email/send?email=${email}&idFacebook=${idFacebook}`);
    },

    addCoupon: (idUser, code) => {
        return axios.post(`${SERVER_URL}/cart/add-coupon`, { idUser, code });
    },

    addCourseToCart: (idUser, _idCourse) => {
        return axios.post(`${SERVER_URL}/cart/add-course`, { idUser, _idCourse });
    },

    removeCourseFromCart: (idUser, _idCourse) => {
        return axios.post(`${SERVER_URL}/cart/remove-course`, { idUser, _idCourse });
    },

    forgotPassword: (email) => {
        return axios.post(`${SERVER_URL}/user/forgot-password`, { email });
    }
}