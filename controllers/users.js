const sendRegistationLetter = require('../mail/registation');
const sendResetPasswordLetter = require('../mail/resetPassword');
const errorHandler = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const Reviews = require('../models/Reviews');
const Goods = require('../models/Goods');
const { createJwtToken, createPopuldatedData } = require('../utils/createFuncs');
const { updateCommodityRating } = require('../utils/updateFuncs');
const { deleteFile, getValidFileName } = require('../utils/workWithFiles');
const { convertDataForClient } = require('../utils/convertFuncs');

module.exports.createUser = async ({ body: { userName, password, email, fullName } }, res) => {
  try {
    const newUser = new Users({
      fullName,
      userName,
      password: await bcrypt.hash(password, 10),
      email,
      cart: {
        cartItems: [],
        totalPrice: 0,
      },
    });
    await newUser.save();
    const token = createJwtToken({ userId: newUser.id }, '1d');
    res.status(201).json({ userData: convertDataForClient(newUser.toObject()), token });
    await sendRegistationLetter(email, userName, fullName, password);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    res.json(await Users.find());
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getUserBoughtGoods = async ({ user: { userId } }, res) => {
  try {
    const user = await Users.findById(userId);
    await createPopuldatedData(user, 'boughtGoods');
    res.json(convertDataForClient({ boughtGoods: user.boughtGoods }));
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getUserReviews = async ({ user: { userId } }, res) => {
  try {
    const user = await Users.findById(userId);
    const userDataWithReviews = await createPopuldatedData(user, 'reviews');
    await createPopuldatedData(userDataWithReviews, 'reviews.commodityId');
    res.json(convertDataForClient({ reviews: user.reviews }, 'user'));
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.authUser = async ({ body: { userName, password } }, res) => {
  try {
    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: '???????????? ???????????????????????? ??????' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '???????????????? ????????????' });
    }
    const token = createJwtToken({ userId: user.id }, '1d');
    if (user.boughtGoods.length) {
      await createPopuldatedData(user, 'boughtGoods');
    }
    if (user.reviews.length) {
      const userDataWithReviews = await createPopuldatedData(user, 'reviews');
      await createPopuldatedData(userDataWithReviews, 'reviews.commodityId');
    }
    res.json({ userData: convertDataForClient(user.toObject(), 'user'), token });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.isValid = async (req, res) => {
  try {
    const user = await Users.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: '????????????????, ???? ???????????? ???????????????????????? ?????? ??????' });
    }
    if (user.boughtGoods.length) {
      await createPopuldatedData(user, 'boughtGoods');
    }
    if (user.reviews.length) {
      const userDataWithReviews = await createPopuldatedData(user, 'reviews');
      await createPopuldatedData(userDataWithReviews, 'reviews.commodityId');
    }
    const newToken = createJwtToken({ userId: user.id }, '1d');
    res.json({ userData: convertDataForClient(user.toObject(), 'user'), newToken });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const commodity = await Goods.findById(req.params.id),
      user = await Users.findById(req.user.userId);

    await user.addToCart(commodity);
    res.json({ message: '?????????? ????????????????' });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const commodity = await Goods.findById(req.params.id),
      user = await Users.findById(req.user.userId);

    await user.removeFromCart(commodity);
    res.json({ message: '?????????? ????????????' });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.buyGoods = async ({ user: { userId } }, res) => {
  try {
    const user = await Users.findById(userId);
    await user.buyGoodsInCart();
    res.json({ message: '?????? ???????????? ???????? ?????????????? ?? ?????????????? ???? ??????????????' });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getUserCart = async (req, res) => {
  try {
    const user = await Users.findById(req.user.userId),
      userCartData = await createPopuldatedData(user, 'cart.cartItems.commodityId'),
      userCart = userCartData.cart.cartItems.map((item) => {
        const id = item.commodityId._id,
          imgSrc = item.commodityId.previewImg.previewImgSrc,
          alt = item.commodityId.previewImg.previewImgAlt,
          title = item.commodityId.title,
          author = item.commodityId.author,
          genres = item.commodityId.genres,
          rating = item.commodityId.rating.general;

        return {
          id,
          copies: item.copies,
          price: item.price,
          imgSrc,
          alt,
          title,
          author,
          genres,
          rating,
        };
      });

    res.json({
      userCart,
      totalPrice: user.cart.totalPrice,
      updatedPrice: user.cart.updatedPrice,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.resetPassword = async ({ body: { email } }, res) => {
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '???????????????? ??????????' });
    }
    const token = createJwtToken({ userId: user.id });
    res.status(201).json({ message: '?????????? ?????? ???????????????????????????? ???????????? ????????????' });
    await sendResetPasswordLetter(email, token);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.createNewPassword = async (req, res) => {
  try {
    const user = await Users.findById(req.user.userId);
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    res.status(201).json({ message: '???????????? ??????????????' });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.updateUserData = async ({ body, user: { userId }, file }, res) => {
  try {
    const newAvatar = {},
      newPassword = {};

    if (file) {
      newAvatar.avatar = file.path;
    }
    if (body?.password) {
      newPassword.password = await bcrypt.hash(body.password, 10);
    }
    const oldUserData = await Users.findByIdAndUpdate(userId, { ...body, ...newAvatar, ...newPassword });
    res.status(200).json({ message: `???????????? ???????????????????????? ?? id: ${userId} ??????????????????` });
    if (newAvatar?.avatar && getValidFileName(oldUserData.avatar) !== 'defaultAvatar.png') {
      deleteFile(getValidFileName(oldUserData.avatar));
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getAdminData = async (req, res) => {
  try {
    const adminData = (await Users.findOne({ userName: 'admin' }, 'fullName surname avatar about')).toObject();
    delete adminData._id;
    res.json(adminData);
  } catch (error) {
    errorHandler(res, error);
  }
};
