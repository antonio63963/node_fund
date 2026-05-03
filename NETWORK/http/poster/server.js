const MyExpress = require("../myExpress.js");
const path = require("node:path");

const USERS = [
  { id: 1, name: "Liam Brown", userName: "liam23", password: "string" },
  { id: 2, name: "Tom Hanks", userName: "tom123", password: "string" },
  { id: 3, name: "Brad Ch", userName: "brad3", password: "string" },
];

const POSTS = [
  {
    id: 1,
    title: "This post #1",
    body: `
    это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил`,
    userId: 1,
  },
  {
    id: 2,
    title: "This post #2",
    body: `
    это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил`,

    userId: 2,
  },
  {
    id: 3,
    title: "This post #3",
    body: `
    это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил`,
    userId: 3,
  },
];

const PORT = 8000;

const server = new MyExpress();

// static
server.route("get", "/", (req, res) => {
  console.log("HOHOHOHOH");
  res.sendFile(path.join(__dirname, "public/index.html"));
});
server.route("get", "/login", (req, res) => {
  console.log("HOHOHOHOH");
  res.sendFile(path.join(__dirname, "public/index.html"));
});
server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css");
});
server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js");
});
//JSON
server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
    console.log("BODY: ", body);
  });

  req.on("end", () => {
    body = JSON.parse(body);
    console.log("PARSED: ", body);

    const username = body.username;
    const password = body.password;

    const user = USERS.find((u) => u.userName == username);
    if (user != null && user.password === password) {
      res.status(200).json({ message: "Logged in successful." });
    } else {
      res.status(401).json({ message: "Need user or password" });
    }
  });
});
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    return (post.author = user.name);
  });
  res.status(200).json(POSTS);
});

server.listen(PORT, () => {
  console.log("Server has ran. ", server.server.address());
});
