const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");
const PersonalDiscountCode = require("../models/PersonalDiscountCode");

const createPersonalDiscountCode = async ({ files, user, body }) => {
    try {
        if (files.length > 0) {
            const imageUrls = files.map(file => file.destination.replace("./src/assets", "") + `/${file.filename}`);
            body = Object.assign(body, { imageUrls });
        }

        Object.keys(body).forEach(key => body[key] === 'undefined' && delete body[key]);
        body = Object.assign(body, { userId: user._id });

        const newPersonalDiscountCode = new PersonalDiscountCode(body);

        await newPersonalDiscountCode.save();
        const personalDiscountCodes = await PersonalDiscountCode.find({});
        return { personalDiscountCodes };
    } catch (e) {
        return { error: e };
    }
};

const getPersonalDiscountCodes = async ({ user }) => {
    try {
        const personalDiscountCodes = await PersonalDiscountCode.find({ userId: user._id });

        return { personalDiscountCodes };
    } catch (e) {
        return { error: e };
    }
};

const deletePersonalDiscountCode = async ({ query: { personalDiscountCodeId } }) => {
    try {
        const personalDiscountCodeDeleted = await PersonalDiscountCode.remove({ _id: personalDiscountCodeId });

        if (personalDiscountCodeDeleted.deletedCount !== 1) {
            throw new CustomError("Xóa mã thất bại!", statusCodes.EXPECTATION_FAILED);
        }

        const personalDiscountCodes = await PersonalDiscountCode.find({});
        return { personalDiscountCodes };
    } catch (e) {
        return { error: e };
    }
};

const updatePersonalDiscountCode = async ({ user, files, body, query: { personalDiscountCodeId } }) => {
    try {
        let imageUrls = [];

        if (body.oldImageUrls || files.length > 0) {
            imageUrls = body.oldImageUrls ? [...body.oldImageUrls] : imageUrls;

            if (files && files.length > 0) {
                imageUrls = [...imageUrls, ...files.map(file => file.destination.replace("./src/assets", "") + `/${file.filename}`)];
            }
            body.oldImageUrls && (delete body['oldImageUrls']);
            body = Object.assign(body, { imageUrls });
        }

        if (Object.keys(body).length > 0) {
            Object.keys(body).forEach(key => body[key] === 'undefined' && delete body[key]);

            const personalDiscountCodeUpdated = await PersonalDiscountCode.findOneAndUpdate({ _id: personalDiscountCodeId }, { $set: body }, { rawResult: true });

            if (personalDiscountCodeUpdated.ok !== 1) {
                throw new CustomError("Cập nhật mã thất bại!", statusCodes.EXPECTATION_FAILED);
            }
        }

        const personalDiscountCodes = await PersonalDiscountCode.find({ userId: user._id });
        return { personalDiscountCodes };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    createPersonalDiscountCode,
    getPersonalDiscountCodes,
    deletePersonalDiscountCode,
    updatePersonalDiscountCode,
};