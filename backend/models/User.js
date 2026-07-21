import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 20
  },
  password: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'dark'
  },
  status: {
    type: String,
    default: 'Anggota Aktif'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
