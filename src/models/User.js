const { hash } = require("bcrypt");
const { Schema, model, models } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    fullName: { type: String, trim: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email invalid!");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    avatarUrl: { type: String },
    role: { type: String },
    discountCodeIds: [{ type: Schema.Types.ObjectId, ref: 'DiscountCode' }],
    tikiAccount: {
        username: { type: String },
        password: { type: String },
        auth: {
            token: { type: String }
        }
    },
    shopeeAccount: {
        username: { type: String },
        password: { type: String },
        auth: { type: String }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY, { expiresIn: "1 days" });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await hash(user.password, 10);
    }

    next();
});

module.exports = models.User || model('User', userSchema);