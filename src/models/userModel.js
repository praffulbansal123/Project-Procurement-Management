import pkg from "mongoose"
import bcrypt from "bcrypt";

const {Schema, model} = pkg


export const userSchema = new Schema({
    title: {type: String, enum: ["Mr", "Mrs", "Miss"], required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    role: {type: String, required: true, enum: ["admin", "client", "procurement manager", "inspection manager"],default: "client"},
    name: {type: String, required: true},
    createdBy : {type: Schema.Types.ObjectId }
})

// password hashing function

userSchema.pre('save', async function (next) {
    try {     
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

const User = model('User', userSchema);

export default User;