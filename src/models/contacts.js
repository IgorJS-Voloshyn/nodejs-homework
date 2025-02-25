import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      default: true,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ContactsCollection = model('contacts', contactSchema);

export { ContactsCollection };
