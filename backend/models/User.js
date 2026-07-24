import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username wajib diisi'],
      unique: true,
      trim: true,
      minlength: [5, 'Username minimal 5 karakter'],
      maxlength: [20, 'Username maksimal 20 karakter']
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi']
    },
    theme: {
      type: String,
      default: 'dark'
    },
    status: {
      type: String,
      default: 'Anggota Aktif'
    }
  },
  {
    timestamps: true // Otomatis mengelola createdAt & updatedAt
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;