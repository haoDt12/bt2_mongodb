
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const expressHbs = require('express-handlebars');
const bodyParser = require("body-parser");

const uri = 'mongodb+srv://haodtph27524:AgV4IfwmFln1Z0PG@atlascluster.ip5xlax.mongodb.net/cp17301?retryWrites=true&w=majority';

const NhanVienModel = require('./NhanVienModel');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
    defaultLayout: 'main'
    
  }))
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    await mongoose.connect(uri);

    console.log('Ket noi DB thanh cong');

    let arrNV = await NhanVienModel.find();

    console.log(arrNV);

    res.send(arrNV);
})

app.get('/add_nv', async (req, res) => {
    await mongoose.connect(uri);

    console.log('Ket noi DB thanh cong');

    let nvMoi = {
        ten: 'Nguyen Thao Trang',
        diachi: 'HN',
        luong: 12
    };

    let kq = await NhanVienModel.insertMany(nvMoi);

    console.log(kq);

    let arrNV = await NhanVienModel.find();

    res.send(arrNV);
})
app.get('/ds', async (req,res) =>{
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Ket noi DB thanh cong');

    //   let nvMoi = {
    //     ten: 'Nguyen Binh Minh',
    //     diachi: 'ND',
    //     luong: 19
    // };

    // let kq = await NhanVienModel.insertMany(nvMoi);
    await NhanVienModel.updateOne({ ten: 'Nguyen Binh Minh'}, { ten: 'Nguyen Thai Nam' });
    await NhanVienModel.deleteOne({ten: 'Nguyen Thao Trang'});
    const nvData= await NhanVienModel.find().lean();
    res.render('list', {nvData});
})
// app.get('/addNewNV', (req, res) => {
//     res.render('addNV');
//   });
//   app.post('/addNewNV/done', async (req, res) => {
//     await mongoose.connect(uri);
//       console.log('Ket noi DB thanh cong');
//       const {ten,diachi,luong}= req.body;
//       console.log(req.body);
//     let nhanvien =await new NhanVienModel({ ten, diachi, luong });
//     await nhanvien.save();
//     res.redirect('/ds');
//   });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

