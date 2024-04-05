import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserShema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    wishLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WishList",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
     
      postalCode: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      houseNumber: {
        type: String,
      },
      roadName: {
        type: String,
      },
      isSelected:{
        type:Boolean,
        default:false
      }
    },
  },
  {
    timestamps: true,
  }
);

//compile the schema to model
const User = mongoose.model("User", UserShema);

export default User;
