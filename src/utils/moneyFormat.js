const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'vnd',
});

const moneyFormat = (number) => {
    return formatter.format(number);
};

module.exports = moneyFormat;

