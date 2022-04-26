const Photo = require('../models/photo.model');
const Voter = require('../models/voter.model');
const requestIp = require('request-ip');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if(title && author && email && file) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];

      if(fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif'){
        const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      } else {
        throw new Error('Wrong file format!');
      }
    } else {
      throw new Error('Wrong input!');
    }

  } catch(err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    
    if(!photoToUpdate) res.status(404).json({ message: 'Not found' });

    const clientIp = requestIp.getClientIp(req); 
    const voter = await Voter.findOne({ user: clientIp });

    if(!voter){
      newVoter = new Voter({ user: clientIp, votes: [ photoToUpdate._id ] });
      await newVoter.save();
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: 'OK' });
    } else if (voter.votes.includes(photoToUpdate._id)){
      res.status(500).json({ message: "You can\'t vote for this photo again!" });
    } else {
        await Voter.updateOne({ _id: voter._id }, { $push: { votes: photoToUpdate._id } });
        photoToUpdate.votes++;
        photoToUpdate.save();
        res.send({ message: 'OK' });
      }
    }
  catch(err) {
    res.status(500).json(err);
  }

};
