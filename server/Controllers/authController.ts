import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '@Models/userModel';
import { IUsers } from '@Interfaces/userType';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '@Utils/catchAsync';
import AppError from '@Utils/AppError';
import Email from '@Utils/email';
import loginLimiter from '@Utils/loginLimiter';
import { ObjectId } from 'mongoose';

const DAY = 24 * 60 * 60 * 1000;

const signToken = (id: string | ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const getTokenExpiration = () =>
  new Date(
    Date.now() + parseFloat(String(process.env.JWT_COOKIE_EXPIRES_IN)) * DAY
  );

const createSendToken = (
  user: IUsers,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);
  const tokenExpiration = getTokenExpiration();

  res.cookie('token', token, {
    expires: tokenExpiration,
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  // eslint-disable-next-line no-param-reassign
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    // token,
    tokenExpiration,
    data: user,
  });
};

export const signup = catchAsync(async (req: Request, res: Response) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = (newUser as IUsers).createEmailConfirmToken();
  await newUser.save({ validateBeforeSave: false });

  const url = `${process.env.CLIENT_URL}/ConfirmEmail/${newUser.email}/Verify/${token}`;
  await new Email(newUser, url).sendConfirmEmail();

  createSendToken(newUser, 201, req, res);
});

export const confirmEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, token } = req.body;

    // 1) Check if email and password exist
    if (!email || !token) {
      return next(
        new AppError(
          'אחד או יותר מפרטי הזיהוי חסרים! יש לשלוח כתובת אימייל וטוקן אימות מייל תקינים.',
          400
        )
      );
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2) Check if user exists && token is correct
    const user = await User.findOne({
      email,
      emailConfirmToken: hashedToken,
    });

    if (!user) return next(new AppError('המשתמש כבר אומת או אינו קיים', 403));

    // 3) Update emailVerified property for the user
    user.emailConfirmToken = undefined;
    user.resetToken = undefined;
    user.emailVerified = true;
    await user.save({
      validateBeforeSave: false,
    });

    // 4) Log the user in, send welcome email & send JWT
    const urlSuccess = `${process.env.CLIENT_URL}/Admin/user/Profile`;
    await new Email(user, urlSuccess).sendWelcome();
    return createSendToken(user, 200, req, res);
  }
);

export const sendConfirmEmail = catchAsync(
  // use it to resend email confirmation
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email)
      return next(new AppError('המייל לא תקין אנא  הכנס מייל תקין', 400));

    // 2) Check if user exists or verified
    const user = await User.findOne({
      email,
    });
    if (!user) return next(new AppError('המשתמש המבוקש אינו קיים .', 401));
    if (user.emailVerified === true)
      return next(new AppError('חשבון המשתמש כבר אומת', 401));

    // 3) Update emailVerified property for the user
    const url = `${process.env.CLIENT_URL}/ConfirmEmail/${user.email}/Verify/${user.resetToken}`;
    await new Email(user, url).sendConfirmEmail();

    return res.status(200).json({ status: 'success' });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(
        new AppError('כתובת מייל או סיסמה חסרים! יש לנסות שוב מחדש.', 400)
      );
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (
      !user ||
      (user.password && !user.correctPassword(password, user.password))
    ) {
      return next(
        new AppError(
          `הסיסמה או כתובת המייל שהוזנו לא נכונים! נותרו עוד ${req.rateLimit.remaining} נסיונות להתחברות`,
          401
        )
      );
    }

    // 3) If everything ok, reset the rate limiter for login route and send token to client
    loginLimiter.resetKey(req.ip);
    createSendToken(user, 200, req, res);
  }
);

export const logout: RequestHandler = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', token: '' });
};

export const csrfToken: RequestHandler = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { csrfToken: req.csrfToken() } });
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.cookies.token) token = req.cookies.token;

    // for token in headers
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //   token = req.headers.authorization.split(' ')[1];
    // } else

    if (!token)
      return next(
        new AppError('אתה לא מחובר! בבקשה התחבר כדי לקבל גישה.', 401)
      );

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById((decoded as jwt.JwtPayload).id);
    if (!currentUser) {
      return next(new AppError('המשתמש המבוקש אינו קיים עוד.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter((decoded as jwt.JwtPayload).iat)) {
      return next(new AppError('סיסמתך שונתה לאחרונה! נא להיכנס שוב.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // roles ['admin']. role='user'
    if (!roles.includes(req.user.role as string)) {
      return next(new AppError(`אין לך הרשאה לבצע פעולה זו!`, 403));
    }

    next();
  };

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('לא קיים משתמש עם כתובת אימייל זו.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
      // const resetURL = `${req.protocol}://${req.get('host')}/ResetPassword/${resetToken}`;
      const resetURL = `${process.env.CLIENT_URL}/ResetPassword/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      return res.status(200).json({
        status: 'success',
        message: 'נשלח אליך מייל לאיפוס הסיסמה',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'הייתה בעיה בשליחת המייל לאיפוס סיסמה, נסה שוב מאוחר יותר!',
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('הוזן token לא חוקי או שפג תוקפו', 400));
    }

    // 3) Update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user from collection
    const user = await User.findById(req.user._id).select('+password');

    if (!user) return next(new AppError('משתמש לא קיים', 404));

    // 2) Check if POSTed current password is correct
    if (
      user.password &&
      !user.correctPassword(req.body.passwordCurrent, user.password)
    ) {
      return next(new AppError('הסיסמה שהוזנה שגויה.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res);
  }
);
