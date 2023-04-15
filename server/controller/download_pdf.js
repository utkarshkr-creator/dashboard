const Teams = require('../models/teams');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');
const User = require('../models/user');

const csvdownload = async (req, res) => {
  const { id } = req.query;
  try {
    const team = await Teams.find({ event_id: id }).populate(
      'team_member',
      'name email techmitiId phone college'
    );
    if (team) {
      const fields = [
        'Event Name',
        'Team Name',
        'Member1 Name',
        'Member1 Email',
        'Member1 PhoneNo',
        'Member1 Techmiti Id',
        'Member1 College',
        'Member2 Name',
        'Member2 Email',
        'Member2 PhoneNo',
        'Member2 Techmiti Id',
        'Member2 College',
        'Member3 Name',
        'Member3 Email',
        'Member3 PhoneNo',
        'Member3 Techmiti Id',
        'Member3 College',
        'Member4 Name',
        'Member4 Email',
        'Member4 PhoneNo',
        'Member4 Techmiti Id',
        'Member4 College',
      ];

      const rows = team.map((data) => {
        const row = {
          'Event Name': data.event_name,
          'Team Name': data.team_name,
        };

        data.team_member.reduce((acc, member, index) => {
          acc[`Member${index + 1} Name`] = member.name;
          acc[`Member${index + 1} Email`] = member.email;
          acc[`Member${index + 1} PhoneNo`] = member.phone;
          acc[`Member${index + 1} Techmiti Id`] = member.techmitiId;
          acc[`Member${index + 1} College`] = member.college;
          return acc;
        }, row);

        return row;
      });

      const csv = json2csv(rows, { fields });
      fs.writeFileSync(`${team[0].event_name}.csv`, csv);
      res.download(`${team[0].event_name}.csv`);
    } else {
      return res.status(404).json('NOT FOUND');
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

const unverifiedData = async (req, res) => {
  try {
    const users = await User.find({ isPaymentVerified: false }, null, {
      sort: { createdAt: -1 },
    }).select(
      'name email phone college techmitiId transactionId caCode paymentMode isReceiptDeleted receipt createdAt'
    );
    res.send(users);
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
};
const allData = async (req, res) => {
  try {
    const users = await User.find({}, null, { sort: { createdAt: -1 } }).select(
      'name email phone createdAt techmitiId transactionId caCode paymentMode isPaymentVerified tshirtSize isAccommodation gender college isReceiptDeleted receipt'
    );
    res.send(users);
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    if (user) {
      await user.remove();

      res.send({ message: 'user deleted' });
    } else {
      res.status(400).send({ message: 'user not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
};
// const downloadReceipt = async (req, res) => {
//   try {
//     const { id } = req.query;
//     const user = await User.findById(id);
//     if (user) {
//       res.download(path.join(__dirname, "..", user.receipt));
//     } else {
//       res.status(400).json({ message: "user not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "internal server error" });
//   }
// };

const verifypayment = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);

    if (user) {
      user.isPaymentVerified = true;
      user.verifiedAt = new Date();
      await user.save();
      res.status(201).json({ message: `${user.techmitiId} is verified` });
    }
  } catch (error) {}
};

module.exports = {
  csvdownload,
  unverifiedData,
  verifypayment,
  allData,
  deleteUser,
};
