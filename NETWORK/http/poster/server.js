const MyExpress = require("../myExpress.js");
const path = require("node:path");

const SESSIONS = [];

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

server.beforeEach((req, res, next) => {
  console.log("MIIIIIDDDDLLLEEE....");
  next();
});

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

server.route("delete", "/api/logout", (req, res) => {});

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
      const authObj = {
        userId: user.id,
        token: Math.floor(Math.random() * 1000000).toString(),
      };
      SESSIONS.push(authObj);
      res.setHeader("Set-Cookie", `token=${authObj.token}; Path=/;`);

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

//Update user info
server.route("put", "api/user", (req, res) => {});
//add new post
server.route("post", "api/posts", (req, res) => {});

server.route("get", "/api/user", (req, res) => {
  // res.sendFile(path.join(__dirname, "public/index.html"));
  console.log("COOKIE: ", req.headers.cookie);
  const token = req.headers.cookie.split("=")[1];

  const s = SESSIONS.find((session) => session.token === token);
  if (s) {
    const user = USERS.find((user) => user.id === s.userId);
    if (!user) {
      res.status(500).json({ message: "Server error User not found..." });
    } else {
      res.status(200).json({ username: user.userName, name: user.name });
    }
  } else {
    res.status(401).json({ message: "Unauthorized..." });
  }

  console.log("token: ", token);
});

server.listen(PORT, () => {
  console.log("Server has ran. ", server.server.address());
});
