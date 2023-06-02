const app = require("./app");

app.listen(4000, () => {
  console.log("Started express at port 3000");
});
//database name is sports_cal

//npx sequelize-cli model:generate --name  todo --attributes title:string ,dueDate:dateOnly,completed:boolean
//npx sequelize-cli db:migrate
