export = {
  mutipleMongooseToObject: function (mongoose: any) {
    return mongoose.map((mongoose: any) => mongoose.toObject());
  },

  mongooseToObject: function (mongoose: any) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
