const User = require("../models/user");
const Team = require("../models/teams");
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

module.exports.profile = async function (req, res) {
  try {
    const user = await User.findOne({ techmitiId: req.params.id }).select(
      "name email techmitiId teams isPaymentInitilized isPaymentVerified -_id"
    );
    res.status(200).json({
      data: {
        user: user,
      },
      message: "user data sent",
    });
  } catch (err) {
    console.log("Error in sending user data", err);
    res.status(500).json({
      message: "Error in sending data",
    });
  }
};

module.exports.checkEmail = async function (req, res) {
  try {
    let { email } = req.query;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      return res.status(200).json({
        message: "email already exists",
      });
    } else {
      return res.status(202).json({
        message: "email not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "error in fetching email",
    });
  }
};
module.exports.checkPhone = async function (req, res) {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (user) {
      return res.status(200).json({
        message: "phone already exists",
      });
    } else {
      return res.status(202).json({
        message: "phone not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "error in fetching phone",
    });
  }
};

module.exports.create = async function (req, res) {
  try {
    User.uploadedReceipt(req, res, async function (err) {
      if (err) {
        console.log("**multer error", err);
      }
      let existingEmailUser = await User.findOne({ email: req.body.email });
      let existingPhoneUser = await User.findOne({ phone: req.body.phone });
      if (!existingEmailUser && !existingPhoneUser) {
        let new_user = new User({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password),
          college: req.body.college,
          regNo: req.body.regNo,
          phone: req.body.phone,
          gender: req.body.gender,
          branch: req.body.branch,
          batch: req.body.batch,
          know: req.body.know,
          isAccommodation: req.body.isAccommodation,
          tshirtSize: req.body.tshirtSize,
          paymentMode: req.body.paymentMode,
          caCode: req.body.caCode,
          receipt: req.body.receipt,
          transactionId: req.body.transactionId,
          techmitiId: `TM23${req.body.phone}`,
          isPaymentInitilized: true,
          isPaymentVerified: false,
          paidAt: new Date(),
        });
        const user = await new_user.save();
        if (req.file) {
          user.receipt = path.posix.join(User.receiptPath, req.file.filename);
          await user.save();
        }

        res.status(200).json({
          message: 'User created',
        });
      } else {
        fs.unlinkSync(
          path.posix.join(__dirname, "..", User.receiptPath, req.file.filename)
        );
        res.status(500).json({
          message: "Phone/Email already exists",
        });
      }
    });
  } catch (err) {
    console.log("Error in creating user", err);
    res.status(500).json({
      message: "Error in creating user",
    });
  }
};

module.exports.createSession = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const new_user = user.select(
          "name email techmitiId teams isPaymentInitilized isPaymentVerified -_id"
        );
        res.status(200).json({
          data: {
            user: new_user,
            token: utils.generateToken(new_user),
          },
          message: "logged in successfully",
        });
      } else {
        res.send(404).json({
          message: "wrong emailid and password",
        });
      }
    } else {
      res.status(500).json({
        data: {
          message: "user not found",
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      data: {
        message: "error",
      },
    });
  }
};

module.exports.registerEvent = async (req, res) => {
  try {
    const team = await Team.create({
      team_name: req.body.teamName,
      event_id: req.body.eventId,
      event_name: req.body.eventName,
    });
    for (const [key, value] of Object.entries(req.body.techMITiId)) {
      let user = await User.findOne({ techmitiId: value });
      if (user) {
        if (
          user.isPaymentInitilized &&
          user.isPaymentVerified &&
          user.paidAt &&
          user.verifiedAt
        ) {
          team.team_member.push(user);
          await team.save();
          user.teams.push(team);
          await user.save();
        } else {
          await team.delete();
          res.status(400).json({
            data: {
              message: `Payment is not done for ${user.techmitiId}`,
            },
          });
          return;
        }
      } else {
        console.log("ele");
        await team.delete();
        res.status(400).json({
          data: {
            message: `user not found for ${value}`,
          },
        });
        return;
      }
    }
    res.status(200).json({
      data: {
        message: `Successfully registered for ${team.event_name} and team Id is ${team._id}`,
      },
    });

    return;
  } catch (err) {
    res.status(500).json({
      data: {
        message: "error in registering for event",
      },
    });
    return;
  }
};
