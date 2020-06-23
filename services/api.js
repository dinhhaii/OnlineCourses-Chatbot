const axios = require('axios'),
    queryString = require('query-string'),
    { SERVER_URL, CHATBOT_URL } = require('../utils/constant');

const instance = axios.create();

module.exports = {
    fetchCourses: (search, popular, offset, limit) => {
        return instance.post(`${SERVER_URL}/course`, { search, popular, offset, limit });
    },

    fetchSubjects: (search, offset, limit) => {
        const query = queryString.stringify({
            search, limit, offset
        });
        return instance.get(`${SERVER_URL}/subject?${query}`);
    },

    fetchUser: (id) => {
        return instance.get(`${SERVER_URL}/user/${id}`);
    },

    fetchUserByEmail: (email) => {
        return instance.get(`${SERVER_URL}/user?email=${email}`);
    },

    fetchCart: (idUser) => {
        return instance.get(`${SERVER_URL}/cart/${idUser}`);
    },

    updateUser: (props) => {
        const { _id, _idUser } = props;
        if (!_idUser && _id) {
            props._idUser = _id;
        }
        delete props.createdAt;
        delete props.updatedAt;

        return instance.post(`${SERVER_URL}/user/update`, { ...props });
    },

    createUser: (props) => {
        return instance.post(`${SERVER_URL}/user/register`, { ...props });
    },

    updateCart: (props) => {
        const { _id, _idCart } = props;
        if (!_idCart && _id) {
            props._idCart = _id;
        }
        return instance.post(`${SERVER_URL}/cart/update`, { ...props });
    },

    createCart: (props) => {
        return instance.post(`${SERVER_URL}/cart/create`, { ...props });
    },

    sendEmail: (email, idFacebook) => {
        return instance.get(`${CHATBOT_URL}/email/send?email=${email}&idFacebook=${idFacebook}`);
    },

    addCoupon: (idUser, code) => {
        return instance.post(`${SERVER_URL}/cart/add-coupon`, { idUser, code });
    },

    addCourseToCart: (idUser, _idCourse) => {
        return instance.post(`${SERVER_URL}/cart/add-course`, { idUser, _idCourse });
    },

    removeCourseFromCart: (idUser, _idCourse) => {
        return instance.post(`${SERVER_URL}/cart/remove-course`, { idUser, _idCourse });
    },

    forgotPassword: (email) => {
        return instance.post(`${SERVER_URL}/user/forgot-password`, { email });
    },

    createSurvey: (_idUser, rate, content) => {
        return instance.post(`${SERVER_URL}/survey/create`, { _idUser, rate, content });
    },

    createTimer: (_idUser, _idInvoice, time, days) => {
        return instance.post(`${SERVER_URL}/notification/create-timer`, { _idUser, _idInvoice, time, days });
    },

    updateTimer: (_idUser, _idInvoice, time, days, status) => {
        return instance.post(`${SERVER_URL}/notification/update-timer`, { _idUser, _idInvoice, status, time, days });
    },

    fetchInvoices: (_idUser) => {
        return instance.get(`${SERVER_URL}/course/${_idUser}/enrolled`);
    }
}