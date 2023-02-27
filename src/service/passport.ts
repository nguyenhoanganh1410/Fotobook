import bcrypt from "bcryptjs";
import passportLocal from "passport-local";
import User from "../model/user";
import IUser from "../interface/user";

const LocalStrategy = passportLocal.Strategy;

const authenticateUser = async (passport: any) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log(`username:::${username}, pass::::${password}`);

      const u = await User.findOne({ email: username }).exec();
      console.log(u);

      if (!u) {
        return done(null, false);
      } else {
        // user deleted
        if (u.deleted === true || !u.status) {
          console.log("user deleted");
          return done(null, false);
        } else if (bcrypt.compareSync(password, u.password)) {
          return done(null, u);
        } else {
          return done(null, false);
        }
      }
    })
  );

  passport.serializeUser((user: IUser, done: any) => {
    console.log("serailize " + user._id);
    done(null, user._id);
  });
  passport.deserializeUser((_id: string, done: any) => {
    console.log(`deserializeUser:::`, _id);
    User.findById(_id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
};

export default authenticateUser;
