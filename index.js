// penginstalan express framework ke node module
const { request, response } = require('express')
const express = require ('express')
// alternatif lain untuk penginstalan express = import express from 'express'

const app = express()
const port = 8080

// setting view engine
app.set(`view engine`, `hbs`)

// untuk mengakses file dalam folder public
app.use(`/public`, express.static(__dirname + `/public`))
// pengiriman object data ke terminal
app.use(express.urlencoded({ extended: false }));

// fungsi menjalankan server untuk mengetahui atau mengetest apakah server berjalan atau tidak melalui console
app.listen(port, function(request, response){
    console.log(`server running on port ${port}`);
})

// arrow function alternatif untuk statement function di atas
// // app.listen(port, () => {
//     console.log(`server running on port ${port}`);
// })

// dibawah ini untuk test request untuk ditampilkan dari server ke browser
// app.get(`/`, (request,response) => {
//     response.send("test word")
// })

let isLogin = true
let dataProject = [
//     {
//     title: "Test Title",
//     description: "Test Description",
//     html: "fa-brands fa-html5",
//     css: "fa-brands fa-css3-alt",
//     javascript: "fa-brands fa-js",
//     reactJs: "fa-brands fa-react",
//     duration:"1 month",
//     startDate: "1 January 2022",
//     endDate: "1 February 2022",
// }
]

app.get(`/`,(request,response) => {
    let data = dataProject.map ((items) =>{
        return{
            ...items,
            isLogin,
        }
    })
    response.render("index",{isLogin,projects:data})
})

app.get(`/contact-me`,(request,response) => {
    response.render("contact-me")
})

app
    .get(`/add-project`,(request,response) => {
    response.render("add-project")
    })
    .post("/add-project",(request,response) => {
    console.log(request.body)
    let data = request.body
    
    data ={
            title: data.projectName,
            startDate: getFullTime(new Date(data.startDate)),
            endDate: getFullTime(new Date(data.endDate)),
            description: data.description,
            html5: data.html5,
            css: data.css,
            javascript: data.javascript,
            reactJs: data.reactjs,
            image: data.inputImage,
            duration: getDistanceTime(
                new Date(data.startDate),
                new Date(data.endDate)
            )
        }
    
        dataProject.push(data)
    response.redirect("/")
    })


app.get("/project-detail/:index",(request,response) => {
    console.log(request.params.index)
    let index = request.params.index
    let project = dataProject[index]
    console.log(project)
    response.render("project-detail", project)
})

app.get("/del-project/:index", (request,response) => {
    let index = request.params.index
    dataProject.splice(index,1)

    response.redirect("/")
})

app
    .get("/edit-project/:index", (request,response) => {
        let index = request.params.index
        console.log(index)

        let edit = dataProject[index]
        console.log(edit)
        
        response.render("edit-project",{isLogin: isLogin, edit, id:index})
    })
    .post("/edit-project/:index", (request,response) =>{
        let data = request.body
        let index = request.params.index

        data = {
            title: data.projectName,
            startDate: getFullTime(new Date(data.startDate)),
            endDate: getFullTime(new Date(data.endDate)),
            description: data.description,
            html5: data.html5,
            css: data.css,
            javascript: data.javascript,
            reactJs: data.reactJs,
            image: data.inputImage,
            duration: getDistanceTime(
                new Date(data.startDate),
                new Date(data.endDate)
            )
        };
        dataProject[index] = data;
        response.redirect("/")
    })

function getFullTime(time) {
    // let date = new Date();
    // let d = date.getDate();
    // let m = date.getMonth();
    // let y = date.getFullYear();

    let m = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December",
    ];
    let d = [
        "01","02","03","04","05","06","07","08","09","10",
        "11","12","13","14","15","16","17","18",
        "19","20","21","22","23","24","25","26",
        "27","28","29","30","31",
    ];

    let dIndex = time.getDate();
    let mIndex = time.getMonth();
    let y = time.getFullYear();

    // if(d == 31){
    //     d = 31;
    // }
    // if(d>31){
    //     d = d - 31;
    // }

    // d = (d<10) ? "0" + d : d;
    // m = (m<10) ? "0" + m : m;
    // y = (y<10) ? "0" + y : y;

    let fullTime = `${d[dIndex]} ${m[mIndex]} ${y}`;
    return fullTime;
}

function getDistanceTime(startDate, endDate){
    let start = new Date(startDate);
    let end = new Date(endDate);
    let getTime = end - start;

    let distanceDay = Math.floor(getTime / (1000 * 3600 * 24));
    let distanceMonth = Math.floor(distanceDay / 31);

    duration =  distanceMonth <= 0 ? distanceDay + " Day" : distanceMonth + " Month";
    // const startMonth = Number(start);
    // const endMonth = Number(end);
    // const duration = endMonth - startMonth
    // return endMonth - startMonth + " " + "month"
    // if(duration === 0) return "<1 month"
    
    if (start < end) {
        return `${duration}`
    }
}