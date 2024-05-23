// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

// const AddressSchema = new Schema({
//   name: {
//     type: String,
//   },
//   phone: {
//     type: String,
//   },
//   postalCode: {
//     type: String,
//   },
//   state: {
//     type: String,
//   },
//   city: {
//     type: String,
//   },
//   houseNumber: {
//     type: String,
//   },
//   roadName: {
//     type: String,
//   },
//   isSelected: {
//     type: Boolean,
//     default: false,
//   },
// });

// const UserSchema = new Schema(
//   {
//     userName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     phoneNumber: {
//       type: Number,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     confirmPassword: {
//       type: String,
//       required: true,
//     },
//     orders: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Order",
//       },
//     ],
//     wishLists: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "WishList",
//       },
//     ],
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     hasShippingAddress: {
//       type: Boolean,
//       default: false,
//     },
//     shippingAddresses: [AddressSchema],
//   },
//   {
//     timestamps: true,
//   }
// );

// // Compile the schema to model
// const User = mongoose.model("User", UserSchema);

// export default User;


import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
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
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new Schema(
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
    shippingAddresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

// Compile the schema to model
const User = mongoose.model("User", UserSchema);
export default User;
