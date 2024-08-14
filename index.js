import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import _ from "lodash";

const app = express();
const port = 3000;
const _dirname = dirname(fileURLToPath(import.meta.url));
let postIdCounter = 5;

const d = new Date();
let year = d.getFullYear();

let posts = [
  {
    id: 1,
    title: "The Best HTML Coding Book",
    date: "March 2022",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id molestie nulla, in mattis lacus. Nulla euismod lectus sit amet mi lobortis lacinia. Nam finibus mi non malesuada ornare. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed id sem ornare massa gravida elementum sit amet eu nulla. Praesent pellentesque est lectus, quis ultricies quam efficitur vitae. Nulla odio elit, pharetra eu elementum ac, euismod interdum tellus. Pellentesque vel metus risus. Curabitur dapibus semper cursus. Etiam sagittis nibh id blandit placerat. Nam varius at neque sit amet faucibus.",
  },
  {
    id: 2,
    title: "How to Hire a Web Designer and Not Get Burned",
    date: "October 2022",
    body: "Vivamus eu arcu ut purus maximus iaculis. Vestibulum at tellus commodo, mollis eros id, sagittis eros. Ut eget tristique velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin quis hendrerit nisi, lobortis hendrerit leo. Pellentesque feugiat neque in egestas euismod. Mauris consequat varius dui, non faucibus est efficitur eu. Proin eget blandit diam, ac lacinia dolor. Etiam blandit lobortis ullamcorper. Vivamus posuere efficitur tellus. Praesent quis cursus urna, nec feugiat nulla. Maecenas eu vehicula magna. Donec ut quam ipsum. Ut neque sem, fermentum nec purus sollicitudin, eleifend efficitur massa. Sed consectetur semper tortor eu egestas. Mauris malesuada risus ac scelerisque sodales.",
  },
  {
    id: 3,
    title: "Code for a Purpose",
    date: "January 2023",
    body: "Maecenas pharetra ut enim at semper. Mauris faucibus bibendum velit, ac aliquam mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus fermentum lectus quis orci vulputate, ut ullamcorper ante facilisis. Suspendisse feugiat luctus lectus ut congue. Vestibulum faucibus scelerisque augue eget euismod. Integer eu velit condimentum, molestie risus sit amet, mattis ante.",
  },
  {
    id: 4,
    title: "Move Fast and Break Things",
    date: "June 2024",
    body: "Sed vel est eu eros dapibus molestie sit amet eget magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc quis mauris et diam vehicula pulvinar. Phasellus sit amet turpis neque. Maecenas pellentesque vel orci ut placerat. Donec porttitor, enim eget commodo euismod, diam lacus gravida felis, eu porttitor elit elit id risus. Suspendisse mattis a magna vitae luctus. Etiam risus ipsum, euismod at est eu, aliquet posuere libero.",
  },
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/css", express.static(_dirname + "/node_modules/bootstrap/dist"));

app.get("/", (req, res) => {
  res.render("home.ejs", {
    posts: posts,
    currentYear: year,
  });
});

app.post("/submit", (req, res) => {
  const inputPost = {
    id: postIdCounter,
    title: req.body["title"],
    date: req.body["date"],
    body: req.body["body"],
  };
  postIdCounter++;
  posts.unshift(inputPost);

  res.render("home.ejs", { posts: posts, currentYear: year });
});

app.post("/edit", (req, res)=> {
  let postToEdit = posts.find((post) => post.id == req.body["id"])
  postToEdit.title = req.body["title"];
  postToEdit.date = req.body["date"];
  postToEdit.body = req.body["body"];

  res.render("home.ejs", { posts: posts, currentYear: year });
  });

app.get("/longPost/:id", (req, res) => {
  const requestedId = _.lowerCase(req.params.id);

  posts.forEach((inputPost) => {
    const storedId = _.lowerCase(inputPost.id);

    if (storedId === requestedId) {
      res.render("longPost.ejs", {
        id: inputPost.id,
        title: inputPost.title,
        date: inputPost.date,
        body: inputPost.body,
        currentYear: year,
      });
    }
  });
});

app.get("/blogList", (req, res) => {
  res.render("blogList.ejs", { posts: posts, currentYear: year });
});

app.get("/delete/:id", (req, res) => {
  const deleteId = _.lowerCase(req.params.id);
  let indexToRemove = -1;
  posts.forEach((inputPost, i) => {
    const preStoredId = _.lowerCase(inputPost.id);
    if (deleteId === preStoredId) {
      indexToRemove = i;
      posts.splice(indexToRemove, 1);
    }
  });
  res.redirect(303, "/");
});

app.get("/newBlog", (req, res) => {
  res.render("newBlog.ejs", { currentYear: year });
});

app.get("/edit/:id", (req, res) => {
  const editId = _.lowerCase(req.params.id);
  posts.forEach((inputPost) => {
    if (editId === _.lowerCase(inputPost.id)) {
      res.render("edit.ejs", {
        id: inputPost.id,
        title: inputPost.title,
        date: inputPost.date,
        body: inputPost.body,
        currentYear: year,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
