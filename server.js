require('dotenv').config() //for accessing dotenv file
const express = require('express')
const app =express()

/*req.body.password - while file is downloaded , to prevent error since not able
to understand the form this below line help express to understand that it will
act like form with multipart 
it is middleware
*/
app.use(express.urlencoded({extended:true}))  //
const multer = require('multer')
const bcrypt = require('bcrypt')
const fileIs = require('./models/file')

const upload = multer({dest:"uploadsf"}) //it will automatically creates the folder

const mongoose = require('mongoose')
const file = require('./models/file')

mongoose.connect(process.env.DATABASE_URL)

app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render("index")
})

app.post('/upload',upload.single("file"),async(req,res)=>{ //before working need to handle files so importing multer
    const formData={
        path: req.file.path,
        orignalName: req.file.originalname //multer property
    }
    if(req.body.password != null && req.body.password !="")
    {
        formData.password = await bcrypt.hash(req.body.password,10)
    }

    const f = await fileIs.create(formData)
    console.log(f)
   // res.send(f.orignalName)
    res.render("index",{fileLink:`${req.headers.origin}/file/${f.id}`})
})

// app.get("/file/:id",handleDownload)
// app.post("/file/:id",handleDownload) //we are making same because the password checking is post
//writing above two lines using route
app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req,res)
{
     //res.send(req.params.id)
     const fileDetail = await fileIs.findById(req.params.id)

     if(fileDetail.password != null)
     {
         if(req.body.password == null)
         {
              res.render("password")
              return
         }
 
         if(!(await bcrypt.compare(req.body.password,fileDetail.password)))
         {
             res.render("password",{error:true})
             return
         }
     }
 
     fileDetail.downloadCount++
     await fileDetail.save()
     console.log(fileDetail.downloadCount)
 
     res.download(fileDetail.path,fileDetail.orignalName)
}

app.listen(process.env.PORT)