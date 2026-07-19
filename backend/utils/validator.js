export const isValidUsername = (username) => {
    const username_regex = /^[A-Za-z][A-Za-z0-9]{4,19}$/;
    return username_regex.test(username);
};

export const isValidPassword = (password) => {
    const password_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,50}$/;
    return password_regex.test(password);
};