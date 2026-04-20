import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

const userSchema = new Schema({
  name: {
    type: String, minlength: 2, maxlength: 30, default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String, required: true, select: false,
  },
  tokens: { type: [{ token: { type: String } }], select: false },
});

export default mongoose.model<IUser>('user', userSchema);
