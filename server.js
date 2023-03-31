
const express = require('express')
const app = express()
const port = 3000

const mongodb = require('mongodb')
const mongoose = require('mongoose');
const expressHbs = require('express-handlebars');
const bodyParser = require("body-parser");

const uri = 'mongodb+srv://haodtph27524:AgV4IfwmFln1Z0PG@atlascluster.ip5xlax.mongodb.net/cp17301?retryWrites=true&w=majority';

const NhanVienModel = require('./NhanVienModel');
const { appendFile } = require('fs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
    defaultLayout: 'main'
    
  }))
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/ds', async (req,res) =>{
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Ket noi DB thanh cong');
    const nvData= await NhanVienModel.find().lean();
    res.render('list', {nvData});
})
app.get('/addNewNV', (req, res) => {
    res.render('addNV');
  });
  app.get('/deleteNV', async (req, res) => {
    let idNV = req.query.idNV
    try {
        NhanVienModel.collection.deleteOne({ _id: new mongodb.ObjectId(`${idNV}`) })
        res.redirect('/ds')
    } catch (error) {

    }
    console.log(idNV);
})
app.get('/editNV', async (req, res) => {
    let idUp = req.query.idEdit
    console.log(idUp);
    try {
        const listNV = await NhanVienModel.find().lean()
        let nvUp = await NhanVienModel.find({ _id: new mongodb.ObjectId(`${idUp}`) }).lean()
        res.render('updateNV', { dataNV: listNV, nhanvien: nvUp[0], index: idUp })
    } catch (error) {
        console.log(error);
    }   
})
  app.get('/addNewNV/done', async (req, res) => {
    await mongoose.connect(uri);
      console.log('Ket noi DB thanh cong');
      let name = req.query.nameNV;
      let address = req.query.diachiNV;
      let salary = req.query.luongNV;
    let nhanvien = new NhanVienModel({ ten: name,diachi: address,luong:salary});
    await nhanvien.save();
    res.redirect('/ds');
  });
  app.get('/updateNV/done', async (req, res) => {
    let name = req.query.upnameNV
    let address = req.query.updiachiNV
    let salary = req.query.upluongNV
    let idNV = req.query.idNVien
    try {
        await mongoose.connect(uri)
        await NhanVienModel.collection.updateOne({ _id: new mongodb.ObjectId(`${idNV}`)}, { $set: { ten: name, diachi:address, luong: salary } })
        res.redirect('/ds')        
    } catch (error) {
        
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

